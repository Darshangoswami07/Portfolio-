export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  hasDemo?: boolean;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Job Portal Platform",
    description: "A full-stack job portal with Student and Recruiter roles, secure authentication, role-based access control, and file upload support.",
    image: "/images/stack-pic-4.jpg",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Redux Toolkit", "Tailwind CSS", "JWT", "Cloudinary"],
    githubUrl: "https://github.com/Darshangoswami07",
    liveUrl: "https://job-portal-kappa-nine.vercel.app/"
  },
  {
    id: 2,
    title: "Angular Shopping App",
    description: "A responsive e-commerce application featuring product listing, category filtering, and shopping cart workflows for a smooth shopping experience.",
    image: "/images/WhatsApp Image 2026-06-11 at 12.08.42 PM (1).jpeg",
    tags: ["Angular", "TypeScript", "HTML", "SCSS", "RxJS"],
    githubUrl: "https://github.com/Darshangoswami07/angular-shopping-app"
  },
  {
    id: 3,
    title: "E-Commerce Website",
    description: "A responsive e-commerce platform with product listing, cart functionality, and a clean, user-friendly shopping experience.",
    image: "/images/WhatsApp Image 2026-06-11 at 1.32.53 PM.jpeg",
    tags: ["HTML", "Tailwind CSS", "JavaScript"],
    githubUrl: "https://github.com/Darshangoswami07",
    liveUrl: "https://myntra-ecommerce-platform.onrender.com/"
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "A personal portfolio website showcasing projects, skills, experience, and contact information with a modern responsive design.",
    image: "/images/darshan-professional-image.png",
    tags: ["React.js", "Tailwind CSS", "JavaScript"],
    githubUrl: "https://github.com/Darshangoswami07"
  },
];
