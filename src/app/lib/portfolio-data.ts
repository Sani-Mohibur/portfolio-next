// Centralized portfolio data for the AI assistant.
// Update this file whenever you add new projects, skills, or change contact info.

export const portfolioData = {
  personal: {
    name: "Mohibur Rahman Sani",
    title: "Full Stack Developer",
    education:
      "Computer Science graduate specializing in Software Engineering",
    about:
      "I'm Mohibur Rahman Sani, a Computer Science graduate specializing in Software Engineering with a strong foundation in full-stack web development. Proficient in Next.js, MERN Stack, TypeScript, PostgreSQL, and Prisma. Experienced in building scalable web applications, authentication systems, Google OAuth integration, real-time applications using Socket.IO, and secure payment integration with Stripe. Adept at problem-solving and writing clean, scalable code.",
    location: "Bangladesh",
  },

  contact: {
    email: "mohiburrahmansani@gmail.com",
    phone: "+8801770553675",
    linkedin: "https://www.linkedin.com/in/Mohibur-Rahman-Sani",
    github: "https://github.com/Sani-Mohibur",
    website: "https://sani-mohibur.netlify.app",
  },

  skills: {
    languages: ["C++", "Java", "C#", "JavaScript", "TypeScript"],
    webStack: [
      "HTML5",
      "CSS3",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
      "Node.js",
      "Express.js",
      "Socket.IO",
    ],
    databases: ["MySQL", "PostgreSQL", "MongoDB", "Prisma ORM", "Mongoose"],
    tools: ["Git", "GitHub", "Postman", "Vite", "Agile & Scrum"],
  },

  projects: [
    {
      title: "Mental Health Tracker",
      description:
        "A responsive mental wellness platform for tracking moods, journaling thoughts, and practicing guided self-care.",
      technologies: ["React", "Tailwind", "Vite", "React Router"],
      github: "https://github.com/Sani-Mohibur/mental-health-tracker",
      live: "https://mental-health-tracker-two.vercel.app/",
    },
    {
      title: "HireMe API",
      description:
        "Scalable backend for a job portal supporting recruiters and job seekers with secure workflows.",
      technologies: ["TypeScript", "Express", "MongoDB", "Zod"],
      github: "https://github.com/Sani-Mohibur/hireme-api",
      live: "",
    },
    {
      title: "Real-Time Chat App",
      description:
        "Real-time chat system with instant messaging and synchronization across clients.",
      technologies: ["Node.js", "Socket.IO", "Express"],
      github: "https://github.com/Sani-Mohibur/chat-backend",
      live: "",
    },
    {
      title: "Ecommerce API",
      description:
        "REST API for ecommerce platform handling products, carts, and authentication.",
      technologies: ["Node.js", "Express", "MongoDB", "JWT"],
      github: "https://github.com/Sani-Mohibur/chat-backend",
      live: "",
    },
  ],

  resume: {
    downloadUrl: "/SaniMohibur_CV.pdf",
    downloadName: "Mohibur Rahman Sani.pdf",
  },
} as const;

export type PortfolioData = typeof portfolioData;
