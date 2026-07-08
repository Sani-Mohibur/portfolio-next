export const portfolioData = {
  personal: {
    name: "Mohibur Rahman Sani",
    title: "FullStack Developer",
    tagline: "Building scalable, secure, and user-focused digital experiences.",
    intro: "Turning ideas into meaningful digital experiences through thoughtful design, clean development, and a passion for creating products people enjoy using.",
    education: "BSc in Computer Science & Engineering from AIUB",
    about:
      "I'm Mohibur Rahman Sani, a Computer Science graduate specializing in Software Engineering with a strong foundation in full-stack web development. Proficient in Next.js, MERN Stack, TypeScript, PostgreSQL, and Prisma. Experienced in building scalable web applications, authentication systems, Google OAuth integration, real-time applications using Socket.IO, and secure payment integration with Stripe. Adept at problem-solving and writing clean, scalable code.",
    location: "Dhaka, Bangladesh",
  },

  contact: {
    email: "mohiburrahmansani@gmail.com",
    phone: "+8801770553675",
    linkedin: "https://www.linkedin.com/in/sani-mohibur",
    github: "https://github.com/Sani-Mohibur",
    website: "https://sani-mohibur.netlify.app",
    instagram: "https://www.instagram.com/farabi_sunny202",
    twitter: "https://x.com/sanimohibur",
  },

  skills: {
    languages: ["TypeScript", "JavaScript", "C++", "Java", "C#", "Go (Golang)"],
    frontend: [
      "Next.js",
      "React.js",
      "Tailwind CSS",
      "Redux Toolkit",
      "TanStack Query",
      "HTML5",
      "CSS3"
    ],
    backend: [
      "Node.js",
      "Express.js",
      "RESTful API Design",
      "WebSockets (Socket.IO)"
    ],
    security: [
      "JWT Authentication",
      "OAuth",
      "Better Auth",
      "RBAC"
    ],
    databases: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Prisma ORM",
      "Mongoose"
    ],
    tools: [
      "Git",
      "GitHub",
      "Postman",
      "Vite",
      "Zod",
      "Agile & Scrum"
    ],
  },

  experience: [
    {
      role: "Junior Backend Developer",
      company: "ScaleUp IT Ltd",
      location: "Dhaka, Bangladesh",
      duration: "01/2026 – 03/2026",
      responsibilities: [
        "Architected and developed RESTful APIs and scalable MongoDB database schemas for production-ready applications, focusing on reliability and scalability.",
        "Engineered backend services using Express.js, integrating Socket.IO for real-time functionality and Stripe for secure payment processing.",
        "Collaborated with frontend developers and designers to resolve system issues, align API contracts, and maintain comprehensive Postman API documentation."
      ]
    }
  ],

  education: [
    {
      degree: "BSc in Computer Science & Engineering",
      institution: "American International University - Bangladesh (AIUB)",
      score: "CGPA: 3.26 out of 4"
    },
    {
      degree: "Higher Secondary Certificate",
      institution: "Milestone College",
      score: "GPA: 5 out of 5"
    },
    {
      degree: "Secondary School Certificate",
      institution: "Shahajuddin Sarker Model School & College",
      score: "GPA: 5 out of 5"
    }
  ],

  projects: [
    {
      title: "SkillBridge (Tutor Marketplace)",
      image: "/skillbridge.png",
      description: "A modern tutor-student marketplace UI utilizing Next.js 16 App Router, ensuring a responsive and accessible mobile-first design.",
      features: [
        "Implemented role-based dashboards (Student, Tutor, Admin) using Next.js parallel routing, secured by client-side session management.",
        "Developed core marketplace features including dynamic availability slots, a multi-stage booking lifecycle, automated review aggregations, and an administrative moderation panel."
      ],
      technologies: ["Next.js 16", "TypeScript", "Express.js", "Prisma", "PostgreSQL", "Tailwind CSS", "Shadcn UI", "Better Auth"],
      githubFrontend: "https://github.com/Sani-Mohibur/tutor-marketplace-frontend",
      githubBackend: "https://github.com/Sani-Mohibur/tutor-marketplace-backend",
      live: "https://tutor-marketplace-sani.vercel.app"
    },
    {
      title: "Thought Space (Blog Platform)",
      image: "/thoughtspace.png",
      description: "A full-stack blog platform with a modular split-schema database architecture using Prisma and PostgreSQL.",
      features: [
        "Integrated Better Auth for seamless cross-domain authentication, featuring secure session management, fallback session-cookie handling and Google OAuth login.",
        "Implemented complex backend business logic, including atomic transaction-based view tracking, a recursive comment system, and multi-table statistical aggregation.",
        "Designed a responsive dashboard utilizing Next.js parallel routing and role-based administrative workspaces."
      ],
      technologies: ["Next.js 15", "TypeScript", "Express.js", "Prisma", "PostgreSQL", "Better Auth", "Tailwind CSS", "Shadcn UI"],
      githubFrontend: "https://github.com/Sani-Mohibur/blog-frontend",
      githubBackend: "https://github.com/Sani-Mohibur/blog-backend",
      live: "https://blog-post-khaki.vercel.app"
    },
    {
      title: "Hire Me (Job Portal)",
      image: "/hireme.png",
      description: "Scalable backend for a job portal supporting recruiters and job seekers with secure workflows.",
      features: [
        "Developed a type-safe backend using TypeScript and Express.js, enforcing strict input validation and data consistency with Zod.",
        "Designed scalable APIs with search, filtering, sorting, and pagination for efficient job and application.",
        "Integrated Role-Based Access Control (RBAC) and secure file management (Multer) to handle CV uploads."
      ],
      technologies: ["TypeScript", "Express.js", "MongoDB", "Mongoose", "Zod"],
      githubBackend: "https://github.com/Sani-Mohibur/hireme-api",
      live: ""
    },
    {
      title: "Mental Health Tracker",
      image: "/mental.png",
      description: "An interactive mental health application with mood tracking and journaling, incorporating a responsive UI, dark mode, and input validation.",
      features: [
        "Enhanced performance through state management and optimized client-side routing for smooth user experience."
      ],
      technologies: ["React.js", "Tailwind CSS", "React Router", "Vite"],
      githubFrontend: "https://github.com/Sani-Mohibur/mental-health-tracker",
      live: "https://mental-health-tracker-two.vercel.app/"
    },
    {
      title: "Real-Time Chat App",
      image: "/chat.png",
      description: "Real-time chat system with instant messaging and synchronization across clients.",
      features: [
        "Built a real-time messaging architecture using Socket.IO for instant communication and persistent chat history.",
        "Enabled message editing and deletion with dynamic, synchronized updates across all active sessions."
      ],
      technologies: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "Socket.IO"],
      githubBackend: "https://github.com/Sani-Mohibur/chat-backend",
      live: ""
    },
    {
      title: "Ecommerce API",
      image: "/ecommerce.png",
      description: "REST API for ecommerce platform handling products, carts, and authentication.",
      features: [
        "Developed a complete product ecosystem including catalog management, filtering by category, brand, keyword, product reviews, sliders, and detailed product information.",
        "•Implemented a complete shopping workflow including cart, wishlist, and invoicing (order system), along with email notifications using Nodemailer and enhanced security using Helmet, CORS, and rate limiting."
      ],
      technologies: ["Node.js", "Express.js", "MongoDB", "Mongoose", "JWT"],
      githubBackend: "https://github.com/Sani-Mohibur/Ecommerce-Project-API",
      live: ""
    }
  ],

  resume: {
    downloadUrl: "/SaniMohibur_CV.pdf",
    downloadName: "Mohibur_Rahman_Sani_CV.pdf",
  },
} as const;

export type PortfolioData = typeof portfolioData;
