export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "telegram-bot-daily-logs",
    title: "Telegram Bot → Daily Logs to GitHub",
    date: "2026-07-10",
    description: "How I built a Telegram bot that automatically pushes my daily logs to a GitHub repository.",
  },
  {
    slug: "3d-phone-tailwind-motion",
    title: "3D Phone with TailwindCSS & Motion.dev",
    date: "2026-07-05",
    description: "Creating a 3D interactive phone mockup using Tailwind CSS and Motion.dev animations.",
  },
  {
    slug: "multiple-github-accounts",
    title: "Multiple GitHub Accounts",
    date: "2026-06-28",
    description: "Managing multiple GitHub accounts on a single machine with SSH configs.",
  },
];
