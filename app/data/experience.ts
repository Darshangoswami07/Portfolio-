export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  technologies?: string[];
  achievements?: string[];
  type: 'work' | 'internship' | 'project' | 'education';
}

export const experiences: Experience[] = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "CADL",
    location: "Zirakpur, Punjab",
    duration: "July 2024 - January 2025",
    description: "Developed responsive web applications with modern UI/UX practices and collaborated with backend and design teams to deliver scalable frontend interfaces.",
    technologies: ["React", "JavaScript", "HTML", "CSS", "Responsive Design", "API Integration"],
    achievements: [
      "Developed responsive web applications using HTML, CSS, JavaScript, and React while following modern UI/UX standards",
      "Built reusable React components to improve maintainability and performance",
      "Collaborated with backend and design teams to integrate APIs and deliver scalable interfaces",
      "Implemented responsive layouts and optimized user experience across devices",
      "Followed clean coding practices and contributed to modern frontend development workflows"
    ],
    type: "internship"
  },
  {
    id: 2,
    title: "Master of Computer Applications (MCA)",
    company: "Amity Online",
    location: "Online",
    duration: "2025 - Present",
    description: "Pursuing postgraduate studies in software engineering with focus on modern web technologies and scalable application development.",
    technologies: ["Software Engineering", "Web Development", "System Design"],
    achievements: [
      "Strengthening core computer science and application development fundamentals",
      "Applying academic learning to real-world full-stack projects"
    ],
    type: "education"
  },
  {
    id: 3,
    title: "Bachelor of Computer Applications (BCA)",
    company: "Amrapali Group of Institutes",
    location: "Haldwani, Uttarakhand",
    duration: "2021 - 2024",
    description: "Completed undergraduate studies in computer applications with practical exposure to programming, web development, and software fundamentals.",
    technologies: ["Programming Fundamentals", "Databases", "Web Technologies"],
    achievements: [
      "Built a strong foundation for full-stack development and problem solving"
    ],
    type: "education"
  },
];
