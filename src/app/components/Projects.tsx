import React from "react";

interface ProjectItem {
  title: string;
  github: string;
  live: string;
  image: string;
  description: string;
  tech: string[];
}

export default function Projects() {
  const projects: ProjectItem[] = [
    {
      title: "Mental Health Tracker",
      github: "https://github.com/Sani-Mohibur/mental-health-tracker",
      live: "https://mental-health-tracker-two.vercel.app/",
      image: "mental.png",
      description:
        "A responsive mental wellness platform for tracking moods, journaling thoughts, and practicing guided self-care.",
      tech: ["React", "Tailwind", "Vite", "React Router"],
    },
    {
      title: "HireMe API",
      github: "https://github.com/Sani-Mohibur/hireme-api",
      live: "",
      image: "hireme.png",
      description:
        "Scalable backend for a job portal supporting recruiters and job seekers with secure workflows.",
      tech: ["TypeScript", "Express", "MongoDB", "Zod"],
    },
    {
      title: "Real-Time Chat App",
      github: "https://github.com/Sani-Mohibur/chat-backend",
      live: "",
      image: "chat.png",
      description:
        "Real-time chat system with instant messaging and synchronization across clients.",
      tech: ["Node.js", "Socket.IO", "Express"],
    },
    {
      title: "Ecommerce API",
      github: "https://github.com/Sani-Mohibur/chat-backend",
      live: "",
      image: "ecommerce.png",
      description:
        "REST API for ecommerce platform handling products, carts, and authentication.",
      tech: ["Node.js", "Express", "MongoDB", "JWT"],
    },
  ];

  return (
    <section id="projects" className="py-20">
      <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">
        Projects
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="group relative rounded-2xl overflow-hidden shadow-lg"
          >
            {/* Image */}
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-64 object-cover transform transition duration-500 ease-out group-hover:scale-110"
            />

            {/* Base Gradient (always visible) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Always visible title */}
            <div className="absolute bottom-0 p-4 text-white">
              <h3 className="text-lg font-semibold">{project.title}</h3>
            </div>

            {/* Hover / Expanded Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end bg-black/80 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition duration-300 text-white">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>

              <p className="text-sm mb-3">{project.description}</p>

              {/* Tech */}
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/20 px-2 py-1 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm hover:underline"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.061.069-.061 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.27.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  Code
                </a>

                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm hover:underline"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Live
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
