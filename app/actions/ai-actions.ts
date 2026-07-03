"use server";

import { prisma, isPrismaEnabled, isMockDbEnabled } from '@/lib/prisma';
import { AIMode, Message, UserConversation, AIProvider } from '@prisma/client';
import * as mockDb from '@/lib/ai/mockDb';

export async function getConversations() {
  if (!isPrismaEnabled()) {
    return isMockDbEnabled() ? mockDb.getConversations() : [];
  }

  try {
    return await prisma.userConversation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { messages: true }
    });
  } catch (error) {
    console.warn('Unable to load conversations from Prisma:', error);
    return isMockDbEnabled() ? mockDb.getConversations() : [];
  }
}

export async function getConversation(id: string) {
  if (!isPrismaEnabled()) {
    return isMockDbEnabled() ? mockDb.getConversation(id) : null;
  }

  try {
    return await prisma.userConversation.findUnique({
      where: { id },
      include: { messages: true }
    });
  } catch (error) {
    console.warn('Unable to load conversation from Prisma:', error);
    return isMockDbEnabled() ? mockDb.getConversation(id) : null;
  }
}

export async function createConversation(mode: AIMode = AIMode.GENERAL) {
  if (!isPrismaEnabled()) {
    if (isMockDbEnabled()) {
      return mockDb.createConversation(mode);
    }

    throw new Error('Database is not configured. Cannot create conversation.');
  }

  try {
    return await prisma.userConversation.create({
      data: {
        title: "New Chat",
      }
    });
  } catch (error) {
    console.warn('Unable to create conversation in Prisma:', error);
    if (isMockDbEnabled()) {
      return mockDb.createConversation(mode);
    }

    throw error;
  }
}

export async function updateConversationTitleAction(id: string, title: string) {
  if (!isPrismaEnabled()) {
    if (isMockDbEnabled()) {
      return mockDb.updateConversationTitle(id, title);
    }

    throw new Error('Database is not configured. Cannot update conversation.');
  }

  try {
    return await prisma.userConversation.update({
      where: { id },
      data: { title }
    });
  } catch (error) {
    console.warn('Unable to update conversation title in Prisma:', error);
    if (isMockDbEnabled()) {
      return mockDb.updateConversationTitle(id, title);
    }

    throw error;
  }
}

export async function deleteConversationAction(id: string) {
  if (!isPrismaEnabled()) {
    if (isMockDbEnabled()) {
      await mockDb.deleteMessagesByConversation(id);
      return mockDb.deleteConversation(id);
    }

    throw new Error('Database is not configured. Cannot delete conversation.');
  }

  try {
    await prisma.message.deleteMany({
      where: { conversationId: id }
    });

    return await prisma.userConversation.delete({
      where: { id }
    });
  } catch (error) {
    console.warn('Unable to delete conversation in Prisma:', error);
    if (isMockDbEnabled()) {
      await mockDb.deleteMessagesByConversation(id);
      return mockDb.deleteConversation(id);
    }

    throw error;
  }
}

export async function getAIUsageStats(): Promise<{ totalChats: number; totalMessages: number; modeStats: Array<{ mode: AIMode; count: number }> }> {
  try {
    // If Prisma isn't enabled (mock mode), avoid attempting to connect
    if (!isPrismaEnabled()) {
      return { totalChats: 0, totalMessages: 0, modeStats: [] };
    }
    const totalChats = await prisma.userConversation.count();
    const totalMessages = await prisma.message.count();

    const modeStats = await Promise.all(
      Object.values(AIMode).map(async (mode) => ({
        mode,
        count: await prisma.message.count({ where: { aiMode: mode } }),
      }))
    );

    return {
      totalChats,
      totalMessages,
      modeStats: modeStats.filter((stat) => stat.count > 0)
    };
  } catch (error) {
    // Suppress detailed DB errors during build/dev when credentials may be missing
    console.warn('Skipping AI usage stats: database unavailable');
    return { totalChats: 0, totalMessages: 0, modeStats: [] };
  }
}
