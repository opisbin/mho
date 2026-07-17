export interface Project {
  title: string;
  slug: string;
  category: string;
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  url: string;
  github: string;
  tags: string[];
  year: number;
  metrics: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    title: "Nova — Autonomous Deployment Platform",
    slug: "nova",
    category: "Software",
    tagline: "Self-healing CI/CD with ML-driven autoscaling",
    description: "AI-driven CI/CD pipeline that auto-scales microservices based on real-time traffic patterns. Self-healing, with zero-downtime rollouts.",
    longDescription: "Nova is a deployment orchestration platform that treats infrastructure as a control problem. A reinforcement-learning policy watches live traffic from the Istio mesh and adjusts replica counts, region weights, and canary percentages every 5 seconds. When a pod starts failing health checks, Nova quarantines it, rotates the underlying node, and replays the queued traffic — all without paging a human. Rollouts are declarative YAML; rollback is one command and completes in under 8 seconds. Built to handle 200+ microservices across 3 regions with a 99.99% SLA.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80&fit=crop",
    url: "https://ping.srbh.site",
    github: "https://github.com/opisbin/ping",
    tags: ["Kubernetes", "Go", "ML", "Istio"],
    year: 2026,
    metrics: [
      { label: "Uptime", value: "99.99%" },
      { label: "Rollback time", value: "< 8s" },
      { label: "Services", value: "200+" },
    ],
  },
  {
    title: "Vox — Multi-Agent Orchestrator",
    slug: "vox",
    category: "AI",
    tagline: "Swarm of LLM agents with shared memory",
    description: "Framework for coordinating swarms of LLM agents with shared memory, tool routing, and human-in-the-loop validation gates.",
    longDescription: "Vox coordinates fleets of LLM agents that share a vector scratchpad, negotiate tool access via a capability registry, and check in with a human reviewer before any side-effecting action. Each agent runs in a sandboxed Deno worker; the orchestrator routes subtasks by capability tags instead of hardcoded roles. A built-in replay engine lets you scrub through every token, tool call, and reasoning step so you can debug a multi-agent run like a video timeline. Deployed internally to automate 40% of triage tickets in a 12-engineer org.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80&fit=crop",
    url: "https://gallery.srbh.site",
    github: "https://github.com/opisbin/creation-gallery",
    tags: ["Python", "LangChain", "FastAPI", "Deno"],
    year: 2026,
    metrics: [
      { label: "Triage automated", value: "40%" },
      { label: "p95 latency", value: "1.2s" },
      { label: "Agents in fleet", value: "32" },
    ],
  },
];

export const allProjects: Project[] = [
  ...projects,
  {
    title: "Synth — Synthetic Data Generator",
    slug: "synth",
    category: "AI",
    tagline: "Privacy-preserving datasets from diffusion",
    description: "Generates privacy-preserving synthetic datasets from real schemas using diffusion models. Used by 3 research labs.",
    longDescription: "Synth ingests a real schema (or a sample CSV) and trains a tabular diffusion model that emits rows statistically indistinguishable from the source but with formal differential-privacy guarantees. A constraint DSL lets you pin invariants — `salary >= 0`, foreign-key cardinality, conditional distributions — that the sampler must respect. Output lands as Parquet, DuckDB, or a live Postgres FDW. Three research labs use it to share sensitive clinical data without legal review.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&fit=crop",
    url: "https://devlog.srbh.site",
    github: "https://github.com/opisbin/devlog",
    tags: ["PyTorch", "DuckDB", "Rust", "DP"],
    year: 2025,
    metrics: [
      { label: "Epsilon (DP)", value: "1.4" },
      { label: "Rows / sec", value: "120k" },
      { label: "Lab users", value: "3" },
    ],
  },
  {
    title: "Flux — Real-Time Dashboard",
    slug: "flux",
    category: "SaaS",
    tagline: "10k events/sec at sub-50ms latency",
    description: "Live observability dashboard for distributed systems. Streams 10k+ events/sec with sub-50ms latency. WebSocket + Redis Streams.",
    longDescription: "Flux is a browser-side observability surface that subscribes directly to Redis Streams consumer groups and renders 10k+ events/second without dropping frames. SVG layer does the heatmap and time-series; a wasm kernel handles the rolling aggregations so the JS thread stays free for interaction. Pin a span, scrub back 30 minutes, correlate across services — all without a round trip. Operators use it as a drop-in replacement for a Grafana panel when they need live tail of a single noisy service.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&fit=crop",
    url: "https://motion-ui.srbh.site",
    github: "https://github.com/opisbin/motion-ui",
    tags: ["React", "WebSocket", "D3", "Wasm"],
    year: 2025,
    metrics: [
      { label: "Throughput", value: "10k/s" },
      { label: "p99 render", value: "48ms" },
      { label: "Bundle", value: "94 kB" },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}
