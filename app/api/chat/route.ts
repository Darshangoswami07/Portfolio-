import { NextRequest, NextResponse } from 'next/server';
import { prisma, isPrismaEnabled } from '@/lib/prisma';
import * as mockDb from '@/lib/ai/mockDb';
import { AIProviderFactory } from '@/lib/ai/providerFactory';
import { AIMessage } from '@/lib/ai/types';
import { performWebSearch, formatSearchResultsForPrompt } from '@/lib/ai/tools/webSearch';
import { AIProvider, AIMode } from '@prisma/client';

export const maxDuration = 60; // Allow longer execution time for AI endpoints

export async function POST(req: NextRequest) {
  try {
    const { conversationId, content, webSearchEnabled, aiMode = 'GENERAL' } = await req.json();

    if (!conversationId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let conversation: any = null;
    if (!isPrismaEnabled()) {
      conversation = await mockDb.getConversation(conversationId);
    } else {
      try {
        conversation = await prisma.userConversation.findUnique({ where: { id: conversationId } });
      } catch (err) {
        // Prisma unavailable - try mock DB
        conversation = await mockDb.getConversation(conversationId);
      }
    }

    if (!conversation) {
      // On Vercel, server actions and route handlers can run in different
      // isolated instances. Recreate the selected conversation in this route
      // instance instead of failing the chat request.
      if (!isPrismaEnabled()) {
        conversation = await mockDb.createConversation(aiMode as any, conversationId);
      } else {
        try {
          await prisma.userConversation.create({
            data: {
              id: conversationId,
              title: 'New Chat',
            },
          });
          conversation = await prisma.userConversation.findUnique({ where: { id: conversationId } });
        } catch (err) {
          conversation = await mockDb.createConversation(aiMode as any, conversationId);
        }
      }
    }

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Save user message immediately (DB or mock)
    if (!isPrismaEnabled()) {
      await mockDb.createMessage({ role: 'user', content, conversationId, aiMode: aiMode as any });
    } else {
      try {
        await prisma.message.create({
          data: {
            role: 'user',
            content,
            conversationId,
            aiMode,
          },
        });
      } catch (err) {
        await mockDb.createMessage({ role: 'user', content, conversationId, aiMode: aiMode as any });
      }
    }

    // Update conversation timestamp
    if (!isPrismaEnabled()) {
      const c = await mockDb.getConversation(conversationId);
      if (c) c.updatedAt = new Date();
    } else {
      try {
        await prisma.userConversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
      } catch (err) {
        const c = await mockDb.getConversation(conversationId);
        if (c) c.updatedAt = new Date();
      }
    }

    // Get previous messages
    let previousMessages: any[] = [];
    if (!isPrismaEnabled()) {
      previousMessages = await mockDb.findMessages(conversationId);
    } else {
      try {
        previousMessages = await prisma.message.findMany({ where: { conversationId }, orderBy: { createdAt: 'asc' }, take: 20 });
      } catch (err) {
        previousMessages = await mockDb.findMessages(conversationId);
      }
    }

    let systemPrompt = getSystemPrompt(aiMode);

    if (webSearchEnabled) {
      const searchResults = await performWebSearch(content, 4);
      if (searchResults.length > 0) {
        systemPrompt += formatSearchResultsForPrompt(searchResults);
      }
    }

    // Prepare messages for AI provider
    const aiMessages: AIMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...previousMessages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // Initialize provider (fall back to a lightweight local provider when no API key is configured)
    let provider: any = null;
    try {
      provider = AIProviderFactory.getProviderFromEnv();
    } catch (err) {
      console.warn('AI provider not configured, using local fallback provider for development.');

      // Local fallback provider that answers common portfolio questions
      provider = {
        getProviderName() {
          return 'local';
        },
        async *streamComplete(messages: any[], _opts: any) {
          const userMsg = messages[messages.length - 1]?.content || '';
          const reply = getLocalFallbackReply(userMsg, aiMode);
          // Simple streaming: emit small chunks
          for (let i = 0; i < reply.length; i += 60) {
            const chunk = reply.slice(i, i + 60);
            yield { choices: [{ delta: { content: chunk } }] };
            // small delay to mimic streaming
            await new Promise((r) => setTimeout(r, 8));
          }
        },
      };
    }

    // Set up text stream
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Process stream asynchronously to not block returning the response
    (async () => {
      let fullAssistantMessage = '';
      try {
        const aiStream = provider.streamComplete(aiMessages, {
          temperature: 0.7,
          maxTokens: 2000,
        });

        for await (const chunk of aiStream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            fullAssistantMessage += delta;
            await writer.write(encoder.encode(delta));
          }
        }
      } catch (error: any) {
        console.error('Streaming error:', error);
        await writer.write(encoder.encode('\n\n**Error:** An issue occurred while generating the response.'));
      } finally {
        await writer.close();

        // Save complete assistant message
        if (fullAssistantMessage) {
          try {
            await prisma.message.create({
              data: {
                role: 'assistant',
                content: fullAssistantMessage,
                conversationId,
                aiMode,
                aiProvider: provider.getProviderName().toUpperCase() as AIProvider
              }
            });

            // Track usage for admin dashboard
            try {
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Start of today

              // Try to find existing stats record for today/provider/mode
              const existingStat = await prisma.aIUsageStats.findFirst({
                where: {
                  date: today,
                  provider: provider.getProviderName().toUpperCase() as AIProvider,
                  mode: aiMode as AIMode
                }
              });

              if (existingStat) {
                // Update existing record
                await prisma.aIUsageStats.update({
                  where: { id: existingStat.id },
                  data: {
                    totalRequests: { increment: 1 },
                    totalTokens: {
                      // For now, we don't have token usage from streaming response
                      // This would need to be enhanced to track actual token usage
                      // We could approximate or leave as 0 for now
                      // In a future improvement, we could get usage from provider response
                      increment: 0
                    }
                  }
                });
              } else {
                // Create new record
                await prisma.aIUsageStats.create({
                  data: {
                    date: today,
                    provider: provider.getProviderName().toUpperCase() as AIProvider,
                    mode: aiMode as AIMode,
                    totalRequests: 1,
                    totalTokens: 0, // To be implemented with actual token tracking
                    errorCount: 0
                  }
                });
              }
            } catch (usageError) {
              console.warn('Failed to track AI usage stats:', usageError);
              // Don't fail the whole request if usage tracking fails
            }
          } catch (err) {
            await mockDb.createMessage({ role: 'assistant', content: fullAssistantMessage, conversationId, aiMode: aiMode as any, aiProvider: provider.getProviderName().toUpperCase() as any });
          }
        }
      }
    })();

    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

function getSystemPrompt(mode: string): string {
  switch (mode) {
    case 'PORTFOLIO':
      return `You are an AI assistant for Darshan Giri Goswami's portfolio. You have access to his professional information:

      Personal Info: Darshan Giri Goswami, Full Stack MERN Developer

      Skills: React.js, Angular, JavaScript, TypeScript, HTML, CSS, Tailwind CSS, SCSS, Bootstrap, Node.js, Express.js, MongoDB, Redux Toolkit, JWT, Role-Based Access Control, Socket.io, Cloudinary, Git, GitHub, REST APIs

      Experience:
      - CADL (Frontend Developer Intern, July 2024 - January 2025)
        * Developed responsive web applications with HTML, CSS, JavaScript, and React
        * Built reusable React components for maintainability and performance
        * Collaborated with backend and design teams for API integration
        * Optimized user experience across devices using responsive design

      Education:
      - MCA, Amity Online (2025 - Present)
      - BCA, Amrapali Group of Institutes, Haldwani (2021 - 2024)

      Projects:
      - Job Portal Platform (React.js, Node.js, Express.js, MongoDB, Redux Toolkit, Tailwind CSS, JWT, Cloudinary)
      - Angular Shopping App (Angular, TypeScript, HTML, SCSS, RxJS)
      - E-Commerce Website (HTML, Tailwind CSS, JavaScript)
      - Portfolio Website (React.js, Tailwind CSS, JavaScript)

      Contact:
      - Email: darshangirigoswami07@gmail.com
      - Location: Bageshwar, Uttarakhand, India
      - LinkedIn: https://www.linkedin.com/in/darshan-goswami-b09137222/
      - GitHub: https://github.com/Darshangoswami07

      When answering questions about Darshan, use only the information above and do not invent details.
      If asked about technologies not listed, say you don't have confirmed portfolio evidence and then provide general guidance.
      Keep responses helpful, accurate, and concise unless detailed explanation is requested.`;

    case 'CODING':
      return `You are an expert coding assistant. You help with:
      - Writing clean, efficient code in various languages
      - Debugging and troubleshooting code issues
      - Explaining programming concepts and algorithms
      - Suggesting best practices and design patterns
      - Code reviews and improvements
      - Learning new technologies and frameworks

      When providing code examples, use proper syntax highlighting and explain what the code does.
      Always strive for production-quality, maintainable code solutions.

      If asked about specific projects or technologies from the portfolio, provide context-aware assistance based on the technologies mentioned in Darshan's experience.`;

    case 'PROJECT_ADVISOR':
      return `You are a project advisor and consultant. You help with:
      - Project planning and architecture
      - Technology stack selection
      - Feature planning and prioritization
      - Development best practices
      - Deployment and DevOps guidance
      - Scalability and performance considerations
      - User experience and interface design

      Draw from Darshan's experience building MERN and frontend-focused web applications including job portals, e-commerce apps, and portfolio projects.
      Provide practical, actionable advice based on real-world development experience.`;

    case 'CAREER_MENTOR':
      return `You are a career mentor and advisor for software developers. You help with:
      - Career development and progression
      - Skill development and learning paths
      - Job search strategies and interview preparation
      - Resume and portfolio improvement
      - Professional networking and branding
      - Workplace skills and professional development
      - Emerging technologies and industry trends

      Base your advice on Darshan's journey as a MERN-focused developer with internship experience and continuous learning through MCA.
      Provide personalized, actionable career guidance.`;

    case 'GENERAL':
    default:
      return `You are a helpful AI assistant. You can:
      - Answer general questions on various topics
      - Provide explanations and tutorials
      - Help with writing and communication
      - Offer suggestions and recommendations
      - Engage in thoughtful discussions

      When asked about Darshan Giri Goswami's portfolio, experience, or projects, refer to the specific information provided in the portfolio context.

      Be helpful, accurate, and engaging in your responses.`;
  }
}

function getLocalFallbackReply(content: string, mode: string) {
  const query = content.toLowerCase().trim();

  const projectsReply = `Darshan has built projects across full-stack and frontend development. Highlights include a Job Portal Platform with role-based access control and authentication, an Angular Shopping App, a responsive E-Commerce Website, and his personal Portfolio Website.`;

  const skillsReply = `Darshan works mainly across full stack JavaScript technologies. His portfolio highlights React.js, Angular, Node.js, Express.js, MongoDB, Tailwind CSS, Redux Toolkit, JWT auth, REST APIs, Cloudinary, and responsive UI development.`;

  const experienceReply = `Darshan's experience includes a Frontend Developer Internship at CADL from July 2024 to January 2025, where he built responsive React interfaces, reusable components, and integrated APIs in collaboration with backend and design teams.`;

  const fullStackReply = `Yes. Darshan is positioned as a Full Stack MERN Developer with practical experience across frontend, backend, authentication, APIs, and database-driven applications.`;

  const contactReply = `You can reach Darshan at darshangirigoswami07@gmail.com or through the contact section of this portfolio. Recruiters can mention role expectations, preferred stack, and team context for faster alignment.`;

  const resumeReply = `Darshan's CV is available from the Resume section in the site navigation. I can also summarize his projects, internship work, and skill fit for specific roles.`;

  const aboutReply = `Darshan Giri Goswami is a Full Stack MERN Developer focused on building scalable web applications with React.js, Node.js, Express.js, and MongoDB. He emphasizes clean code, responsive UI, and practical product development.`;

  const recruiterReply = `For recruiters, Darshan is a strong fit for frontend and full-stack MERN roles involving React, Node.js, Express, MongoDB, REST APIs, and authentication-driven product development.`;

  const personalReply = `Darshan Giri Goswami is a Full Stack MERN Developer based in Bageshwar, Uttarakhand, India. He has internship experience as a Frontend Developer Intern at CADL (July 2024 - January 2025), is currently pursuing MCA at Amity Online (2025 - Present), and completed BCA from Amrapali Group of Institutes (2021 - 2024). You can contact him at darshangirigoswami07@gmail.com, LinkedIn: https://www.linkedin.com/in/darshan-goswami-b09137222/, GitHub: https://github.com/Darshangoswami07.`;

  if (query.includes('project')) return projectsReply;
  if (query.includes('skill') || query.includes('technology') || query.includes('tech stack')) return skillsReply;
  if (query.includes('experience') || query.includes('worked at') || query.includes('company')) return experienceReply;
  if (query.includes('personal') || query.includes('about yourself') || query.includes('introduce yourself') || query.includes('who are you') || query.includes('bio')) return personalReply;
  if (query.includes('name') || query.includes('location') || query.includes('where') || query.includes('email') || query.includes('linkedin') || query.includes('github')) return personalReply;
  if (query.includes('full stack') || query.includes('frontend') || query.includes('backend')) return fullStackReply;
  if (query.includes('contact') || query.includes('reach') || query.includes('hire')) return contactReply;
  if (query.includes('resume') || query.includes('cv')) return resumeReply;
  if (query.includes('recruiter') || query.includes('role fit') || query.includes('fit for')) return recruiterReply;
  if (query.includes('about') || query.includes('who is') || query.includes('introduce')) return aboutReply;

  if (mode === 'PORTFOLIO') {
    return `${aboutReply} ${skillsReply} ${experienceReply} Ask about projects, skills, experience, or role fit and I can answer in more detail.`;
  }

  return `I'm running in local portfolio assistant mode right now, so I can still help with Darshan's projects, skills, experience, role fit, and contact details. Try asking about projects, skills, experience, resume, or recruiter fit.`;
}
