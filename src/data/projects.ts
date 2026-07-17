export interface Project {
  title: string;
  description: string;
  image: string;
  url: string;
  github: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    title: "Ping",
    description: "A real-time chat application built with Next.js and WebSockets. Features group chats, file sharing, and typing indicators.",
    image: "https://ik.imagekit.io/srbh/ping.png?tr=f-auto,w-600,q-80",
    url: "https://ping.srbh.site",
    github: "https://github.com/srbh/ping",
    tags: ["Next.js", "WebSocket", "TypeScript"],
  },
  {
    title: "Creation Gallery",
    description: "An art showcase platform for digital creators. Upload, share, and discover artwork with a sleek masonry layout.",
    image: "https://ik.imagekit.io/srbh/creation-gallery.png?tr=f-auto,w-600,q-80",
    url: "https://gallery.srbh.site",
    github: "https://github.com/srbh/creation-gallery",
    tags: ["React", "Masonry", "PostgreSQL"],
  },
];

export const allProjects: Project[] = [
  ...projects,
  {
    title: "DevLog",
    description: "A developer logging tool that automatically pushes daily notes to GitHub.",
    image: "https://ik.imagekit.io/srbh/devlog.png?tr=f-auto,w-600,q-80",
    url: "https://devlog.srbh.site",
    github: "https://github.com/srbh/devlog",
    tags: ["Python", "GitHub API", "CLI"],
  },
  {
    title: "Motion UI",
    description: "A collection of reusable animation components built with Motion for React.",
    image: "https://ik.imagekit.io/srbh/motion-ui.png?tr=f-auto,w-600,q-80",
    url: "https://motion-ui.srbh.site",
    github: "https://github.com/srbh/motion-ui",
    tags: ["React", "Motion", "Storybook"],
  },
];
