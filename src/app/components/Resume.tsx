import React from "react";

export default function Resume() {
  return (
    <section id="resume" className="py-10">
      <h2 className="text-3xl font-semibold mb-8">Resume</h2>
      <p className="mb-4 max-w-xl text-inherit opacity-90">
        You can download my complete resume to know more about my qualifications
        and experience.
      </p>
      <a
        href="/SaniMohibur_CV.pdf"
        download="Mohibur Rahman Sani.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded 
        hover:bg-blue-700 transition-colors duration-200 focus:outline-none 
        focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Download Resume
      </a>
    </section>
  );
}
