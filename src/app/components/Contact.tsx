import React from "react";

export default function Contact() {
  return (
    <section id="contact" className="py-8">
      <h2 className="text-3xl font-semibold mb-8">Contact Me</h2>
      <p className="mb-4 max-w-xl text-inherit opacity-90">
        Feel free to reach out to me via email or connect on LinkedIn and
        GitHub.
      </p>
      <ul className="space-y-2 text-inherit opacity-90">
        <li>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:mohiburrahmansani@gmail.com"
            className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
          >
            mohiburrahmansani@gmail.com
          </a>
        </li>
        <li>
          <strong>Phone:</strong> +8801770553675
        </li>
        <li>
          <strong>LinkedIn:</strong>{" "}
          <a
            href="https://www.linkedin.com/in/Mohibur-Rahman-Sani"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
          >
            Mohibur-Rahman-Sani
          </a>
        </li>
        <li>
          <strong>GitHub:</strong>{" "}
          <a
            href="https://github.com/Sani-Mohibur"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
          >
            Sani-Mohibur
          </a>
        </li>
      </ul>
    </section>
  );
}
