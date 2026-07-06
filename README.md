<div align="center">
  <img src="https://via.placeholder.com/1200x300/111827/6366f1?text=Mohibur+Rahman+Sani+-+Portfolio" alt="Mohibur Rahman Sani Portfolio Banner" width="100%" />
  
  <br />
  <br />

  <h1>🚀 Mohibur Rahman Sani | Developer Portfolio</h1>
  
  <p>
    <b>A modern, responsive, and interactive personal portfolio showcasing my skills, projects, and professional experience as a Full Stack Developer.</b>
  </p>

  <p>
    <a href="https://sani-mohibur.netlify.app">Live Demo</a> •
    <a href="#-features">Features</a> •
    <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-contact">Contact</a>
  </p>
</div>

---

## 📖 Project Overview

This is my personal portfolio website, designed to provide a comprehensive view of my capabilities as a Software Engineer. Built from the ground up with **Next.js 16**, it features a beautiful, fully responsive design, seamless dark/light mode integration, and a highly interactive **AI Portfolio Assistant** powered by Groq (Llama 3) to answer visitors' questions about my background in real-time.

## ✨ Features

- **🤖 AI Portfolio Assistant**: Integrated AI chatbot (Groq + Llama 3) that contextually answers questions about my skills, projects, and resume.
- **🌗 Dark / Light Mode**: Seamless theme switching with local storage persistence.
- **📱 Fully Responsive**: Flawless layout across all devices (from 320px mobile to 4K desktop).
- **🎭 Smooth Animations**: Scroll-triggered fade-ins and micro-interactions powered by Framer Motion.
- **⚡ High Performance**: Optimized with Next.js App Router, minimal client-side JavaScript, and Tailwind CSS.
- **🎨 Glassmorphism UI**: Modern aesthetic with gradients, blurs, and polished UI components.

---

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

### Styling & UI
- **CSS Framework**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) + Custom SVGs

### AI Integration
- **LLM Provider**: [Groq SDK](https://groq.com/) (`llama-3.3-70b-versatile`)
- **Markdown Rendering**: `react-markdown`

### Deployment
- **Hosting**: [Netlify](https://www.netlify.com/)

---

## 📂 Folder Structure

```text
portfolio-next/
├── public/                 # Static assets (images, PDFs, SVGs)
├── src/
│   └── app/
│       ├── api/            # Next.js Route Handlers (Backend API)
│       │   └── chat/       # AI Assistant streaming endpoint
│       ├── components/     # React Components
│       │   ├── chat/       # Chat UI components (Window, Button, Messages)
│       │   └── ...         # Section components (About, Skills, Projects)
│       ├── lib/            # Utility and Config files
│       │   ├── ai-config.ts    # AI System Prompt configuration
│       │   └── portfolio-data.ts # Single source of truth for portfolio data
│       ├── globals.css     # Global styles and Tailwind configuration
│       ├── layout.tsx      # Root layout (Fonts, Meta tags)
│       └── page.tsx        # Main entry page
├── .env.example            # Environment variables template
├── next.config.ts          # Next.js configuration
├── netlify.toml            # Netlify deployment configuration
└── tailwind.config.ts      # Tailwind configuration
```

---

## 📸 Screenshots

| Light Mode | Dark Mode |
| :---: | :---: |
| <img src="https://via.placeholder.com/500x300/ffffff/6366f1?text=Light+Mode+Screenshot" alt="Light Mode" width="100%"/> | <img src="https://via.placeholder.com/500x300/111827/9333ea?text=Dark+Mode+Screenshot" alt="Dark Mode" width="100%"/> |

| Projects Section | AI Chat Assistant |
| :---: | :---: |
| <img src="https://via.placeholder.com/500x300/1e293b/38bdf8?text=Projects+Grid" alt="Projects" width="100%"/> | <img src="https://via.placeholder.com/500x300/0d1117/a855f7?text=AI+Chat+Interface" alt="AI Chat" width="100%"/> |

---

## ⚙️ Installation

To run this project locally, you need [Node.js](https://nodejs.org/) installed on your machine.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sani-Mohibur/portfolio-next.git
   cd portfolio-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🔐 Environment Variables

The AI Assistant requires an API key. 
1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and add your Groq API key:
   ```env
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```
   *(You can get a free key from the [Groq Console](https://console.groq.com/keys))*

## 🚀 Running Locally

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🏗️ Production Build

To create an optimized production build:
```bash
npm run build
```
To test the production build locally:
```bash
npm run start
```

---

## 🌐 Deployment

This project is configured for seamless deployment on **Netlify**. It uses the `@netlify/plugin-nextjs` package and is configured via `netlify.toml`.

To deploy:
1. Push your code to GitHub.
2. Connect the repository to Netlify.
3. Add the `GROQ_API_KEY` in your Netlify Environment Variables settings.
4. Netlify will automatically build and deploy.

---

## 🔮 Future Improvements

- [ ] Add a dedicated blog section for technical writing.
- [ ] Implement multi-language support (i18n).
- [ ] Add interactive 3D elements using Three.js/React Three Fiber.
- [ ] Integrate a CMS (e.g., Sanity or Contentful) for easier project updates.

---

## 🔗 Links

- **Live Demo**: [https://sani-mohibur.netlify.app](https://sani-mohibur.netlify.app)
- **GitHub Repository**: [https://github.com/Sani-Mohibur/portfolio-next](https://github.com/Sani-Mohibur/portfolio-next)

---

## 📫 Contact

- **Email**: [mohiburrahmansani@gmail.com](mailto:mohiburrahmansani@gmail.com)
- **LinkedIn**: [Mohibur Rahman Sani](https://www.linkedin.com/in/Mohibur-Rahman-Sani)
- **GitHub**: [@Sani-Mohibur](https://github.com/Sani-Mohibur)

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to use the structure for your own portfolio!
