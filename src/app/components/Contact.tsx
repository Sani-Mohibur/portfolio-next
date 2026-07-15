"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "../lib/portfolio-data";
import { MailIcon, InstagramIcon, TwitterIcon } from "./icons";
import { CheckIcon, CopyIcon, MapPin, Phone, Send } from "lucide-react";
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100"
    >
      {copied ? (
        <CheckIcon className="w-3.5 h-3.5" />
      ) : (
        <CopyIcon className="w-3.5 h-3.5" />
      )}
    </button>
  );
};

export default function Contact() {
  const { contact, personal } = portfolioData;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    const key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!key) {
      setIsSubmitting(false);
      setSubmissionStatus({
        success: false,
        message: "Missing Access Key config.",
      });
      return;
    }

    const submissionData = new FormData();
    submissionData.append("access_key", key);
    submissionData.append("subject", "New Portfolio Message");
    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("message", formData.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submissionData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmissionStatus({
          success: true,
          message: "Message sent successfully!",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmissionStatus({
          success: false,
          message: data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      setSubmissionStatus({
        success: false,
        message: "Failed to connect. Please check network.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-20 relative">
      <div className="flex flex-col items-center justify-center mb-16 text-center">
        <h2 className="select-none text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Get In Touch
        </h2>
        <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Left Side: Info & Social Proof */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="select-none space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Let's Connect and Share Ideas Together
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Whether it's tech, ideas, or just a friendly conversation, feel
              free to reach out. Every great connection starts with a simple
              hello.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <MailIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="select-none text-sm text-gray-500 dark:text-gray-400 font-medium mb-0.5">
                  Email Me
                </p>
                <div className="flex items-center">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-gray-900 dark:text-white font-semibold hover:text-indigo-600 transition-colors"
                  >
                    {contact.email}
                  </a>
                  <CopyButton text={contact.email} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="select-none text-sm text-gray-500 dark:text-gray-400 font-medium mb-0.5">
                  Call Me
                </p>
                <div className="flex items-center">
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {contact.phone}
                  </p>
                  <CopyButton text={contact.phone} />
                </div>
              </div>
            </div>

            <div className="select-none flex items-center gap-4">
              <div className="p-3 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-0.5">
                  Location
                </p>
                <p className="text-gray-900 dark:text-white font-semibold">
                  {personal.location}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="select-none text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Social Profiles
            </p>
            <div className="flex gap-4">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all transform hover:-translate-y-1"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={contact.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all transform hover:-translate-y-1"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-10 shadow-[var(--shadow-premium)] dark:shadow-[var(--shadow-premium-dark)] border border-gray-100 dark:border-gray-800"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-shadow"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your Email
              </label>
              <input
                type="type"
                id="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-shadow"
                placeholder="Enter your email address"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-shadow resize-none"
                placeholder="How can I help you?"
              />
            </div>

            {submissionStatus && (
              <p
                className={`text-sm font-medium text-center ${submissionStatus.success ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
              >
                {submissionStatus.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform transition-all hover:-translate-y-1"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
