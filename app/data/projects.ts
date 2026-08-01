export type ProjectStatus = 'Live' | 'Completed' | 'In Progress';

export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image?: string;
  status: ProjectStatus;
  tags: string[];
  filterTags: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  hasDemo?: boolean;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'JobHub — Job Portal Platform',
    description:
      'A full-stack job portal with Student and Recruiter roles, secure authentication, role-based access control, and file upload support.',
    longDescription:
      'JobHub is a full-stack job marketplace built on the MERN stack. Recruiters can post and manage job listings while candidates can search, filter, and apply with resume uploads handled through Cloudinary. Access is fully role-based and protected end-to-end with JWT authentication, and applications are tracked in real time from a dedicated dashboard.',
    image: '/images/projects/job-portal.jpg',
    status: 'Live',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'JWT', 'Cloudinary'],
    filterTags: ['React', 'Node.js', 'MongoDB'],
    features: [
      'Role-based access for recruiters & candidates',
      'JWT authentication & protected routes',
      'Advanced job search & filtering',
      'Real-time application tracking dashboard',
      'Resume & file uploads via Cloudinary',
    ],
    githubUrl: 'https://github.com/Darshangoswami07/JobPilot-AI',
    liveUrl: 'https://job-portal-kappa-nine.vercel.app',
    featured: true,
  },
  {
    id: 2,
    title: 'Portfolio Website',
    description:
      'A personal portfolio showcasing projects, skills, experience, and an AI assistant, built with a modern, fully responsive design.',
    longDescription:
      'This portfolio itself — a Next.js 15 App Router site with a MERN-adjacent backend (Prisma + Postgres) powering an AI chat assistant, appointment booking with email/SMS notifications, and an internal analytics dashboard. Styled with Tailwind CSS v4 and animated throughout with Framer Motion, with full dark mode support.',
    image: '/images/projects/portfolio.jpg',
    status: 'Live',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Prisma'],
    filterTags: ['React', 'Next.js', 'TypeScript'],
    features: [
      'AI assistant chat integrated site-wide',
      'Appointment booking with email/SMS alerts',
      'Full dark mode with premium glass UI',
      'Internal analytics dashboard',
      'Fully responsive, accessible design',
    ],
    githubUrl: 'https://github.com/Darshangoswami07/Portfolio-',
    liveUrl: 'https://portfolio-rouge-ten-ric6b2uei5.vercel.app',
    featured: true,
  },
  {
    id: 3,
    title: 'Angular Shopping App',
    description:
      'A responsive e-commerce application featuring product listing, category filtering, and shopping cart workflows for a smooth shopping experience.',
    longDescription:
      'A college-level e-commerce web app built to demonstrate practical Angular knowledge — components, services, routing, and state management — styled with Tailwind CSS. Includes product listing, category browsing, and a fully working add-to-cart flow with a responsive, modern UI.',
    image: '/images/projects/angular-shopping-app.jpg',
    status: 'Completed',
    tags: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Tailwind CSS'],
    filterTags: ['Angular', 'TypeScript'],
    features: [
      'Product listing & category browsing',
      'Cart management with reactive state',
      'Service-based Angular architecture',
      'Modern, responsive Tailwind UI',
    ],
    githubUrl: 'https://github.com/Darshangoswami07/angular-shopping-app',
    liveUrl: 'https://shopping-app-meridian.vercel.app',
  },
  {
    id: 4,
    title: 'Myntra-Style E-Commerce Platform',
    description:
      'A full-stack e-commerce application inspired by Myntra, with dynamic product listings, cart management, and scalable state handling.',
    longDescription:
      'An e-commerce storefront inspired by Myntra, built with React.js and Redux Toolkit on the frontend and a Node.js/Express backend serving product data. Features live cart totals in INR, add/remove-from-cart flows, and a clean, scalable state architecture designed for a seamless shopping experience.',
    image: '/images/projects/myntra-ecommerce.jpg',
    status: 'Completed',
    tags: ['React.js', 'Redux Toolkit', 'Node.js', 'Express.js'],
    filterTags: ['React', 'Node.js'],
    features: [
      'Dynamic product listing from backend APIs',
      'Add/remove cart with live INR totals',
      'Scalable Redux Toolkit state management',
      'Clean, responsive shopping UI',
    ],
    githubUrl: 'https://github.com/Darshangoswami07/myntra-ecommerce-platform',
    liveUrl: 'https://myntra-ecommerce-platform.vercel.app',
  },
  {
    id: 5,
    title: 'Agentic AI Research Platform',
    description:
      'A production-ready agentic AI research platform combining LangGraph orchestration, retrieval-augmented generation, and a scalable backend.',
    longDescription:
      'A production-ready Agentic AI Research Platform built with Next.js on the frontend and FastAPI on the backend. Uses LangGraph for multi-agent orchestration, a Retrieval-Augmented Generation (RAG) pipeline for grounded answers, and MCP for tool integration — backed by PostgreSQL, Redis, and Qdrant for persistence, caching, and vector search.',
    status: 'In Progress',
    tags: ['Next.js', 'FastAPI', 'LangGraph', 'RAG', 'PostgreSQL', 'Redis', 'Qdrant'],
    filterTags: ['AI/ML', 'Next.js'],
    features: [
      'Multi-agent orchestration with LangGraph',
      'Retrieval-Augmented Generation (RAG) pipeline',
      'MCP-based tool integration',
      'Vector search via Qdrant',
      'Production-ready FastAPI backend',
    ],
    githubUrl: 'https://github.com/Darshangoswami07/agentic-ai-research-platform',
  },
  {
    id: 6,
    title: 'Mini Social Media App',
    description:
      'A React-based social feed app built with hooks — create, view, and delete posts through a clean, minimal UI.',
    longDescription:
      'A lightweight social media simulation built to practice core React patterns without any external state library. Posts are created, listed, and removed entirely through function components and hooks, paired with a navigation bar and sidebar for a realistic feed layout.',
    status: 'Completed',
    tags: ['React', 'JavaScript', 'CSS'],
    filterTags: ['React'],
    features: [
      'Create, view, and delete posts',
      'Hooks-only state management, no external store',
      'Navbar + sidebar feed layout',
      'Clean, minimal responsive UI',
    ],
    githubUrl: 'https://github.com/Darshangoswami07/mini-social-media',
  },
];
