"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group block"
    >
      <div className="aspect-video rounded-lg overflow-hidden bg-surface-card mb-3 border bd-cute">
        <Image
          src={project.image}
          alt={project.title}
          width={600}
          height={338}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
      <h3 className="text-base font-semibold tx-main mb-1">{project.title}</h3>
      <p className="text-sm tx-muted leading-relaxed">{project.description}</p>
    </motion.a>
  );
}
