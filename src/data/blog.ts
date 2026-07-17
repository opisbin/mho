export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: string;
  tags: string[];
  body: { heading?: string; text: string }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "control-theory-for-autonomous-systems",
    title: "Borrowing from Control Theory to Ship Autonomous Systems",
    date: "2026-07-08",
    description: "Why closed-loop feedback, deadbands, and stability margins from 1940s control engineering are the missing mental model for shipping agents that don't drift.",
    readingTime: "8 min",
    tags: ["Autonomous Systems", "Control Theory", "Engineering"],
    body: [
      {
        text: "Every autonomous system I've shipped that worked in production has had one thing in common: it treats its actions as a control problem, not a planning problem. The difference sounds academic until your autonomous deployment starts oscillating between two replica counts every five minutes and pages the on-call at 3am.",
      },
      {
        heading: "Open-loop vs closed-loop agents",
        text: "Most 'autonomous' LLM demos are open-loop: take a goal, emit a plan, execute it, done. The model never observes the effect of its own actions. That's fine for 'write me a summary'; it's catastrophic for 'scale this service.' A control loop needs a sensor, a setpoint, a controller, and an actuator. The LLM is the controller. The actuator is whatever API mutates the world. The sensor is whatever lets you read the world back. The setpoint is the human's intent. Skip any of the four and you've built a script, not a system.",
      },
      {
        heading: "Deadbands and stability",
        text: "The cheapest stability fix I know is a deadband. If the measured value is within 5% of setpoint, do nothing. This is unsatisfying because doing nothing feels like a bug. But every system that reacts to noise will amplify noise. Your drift was not from a missing policy; it was from reacting to a signal that was already inside the noise floor. Add the deadband first, then tune your controller.",
      },
      {
        heading: "What I actually ship",
        text: "Three building blocks: a sensor that polls (never pushes — I want to control the sample rate), a controller that takes (setpoint, measured, history) and returns an action, and an actuator that applies the action and confirms before the next tick. The controller is allowed to be an LLM. The other two should be boring deterministic code. When something goes wrong, and it will, the boring code is where you can actually reason about it at 3am.",
      },
    ],
  },
  {
    slug: "synthetic-data-with-formal-privacy",
    title: "Synthetic Data That Doesn't Leak: A Practical Diffusion Recipe",
    date: "2026-06-22",
    description: "How to train a tabular diffusion model that's statistically faithful AND has a real (1.4, 10⁻⁹) privacy guarantee — without hand-rolling DP-SGD from scratch.",
    readingTime: "11 min",
    tags: ["ML", "Privacy", "PyTorch"],
    body: [
      {
        text: "The promise of synthetic data is 'share the data without sharing the data.' Most attempts fall into two camps: statistically faithful but no privacy guarantee, or formally private but useless. This is how I got to (1.4, 10⁻⁹) with a KL divergence under 0.03 against the real marginal distributions on six clinical tables.",
      },
      {
        heading: "The hard part isn't the model",
        text: "Tabular diffusion is a solved problem once you have the architecture from STasy / TabDDPM. The hard part is enforcing constraints. A synthetic patient can't be pregnant and 78. Their BMI can't be negative. Foreign keys have to resolve. If the model emits a row that violates an invariant, you've either silently corrupted downstream analysis or you've trained a sampler that wastes 30% of its draws on rows you'll reject.",
      },
      {
        heading: "Constraint as a projection",
        text: "Treat the constraint set C as a subspace you project onto after every sampling step. This is just projected gradient descent adapted to diffusion. The trick is making the projection cheap — for inequality constraints it's a clamp, for foreign-key cardinality it's a bucket sort, for conditional distributions it's a row-level resampling. Done right, >99% of draws survive.",
      },
      {
        heading: "The DP accounting",
        text: "Use Opacus with Poisson sampling and a per-step gradient clip of 1.0. Accountant: RDP, target δ=10⁻⁹, T = 50k steps, batch size 2048, dataset size 92k. You'll land around ε=1.4 if you drop the learning rate schedule and accept a longer warmup. Don't trust me — run the accountant yourself, the units are confusing and the error is one order of magnitude.",
      },
    ],
  },
  {
    slug: "i-sold-my-side-project-to-a-research-lab",
    title: "I Sold My Side Project to a Research Lab. Here's What I'd Tell My Past Self.",
    date: "2026-05-30",
    description: "The business model for solo dev tools nobody warned anyone about: not VC, not bootstrapping, just three institutions funding you because you're cheaper than the alternative.",
    readingTime: "6 min",
    tags: ["Indie", "Career", "Lessons"],
    body: [
      {
        text: "Last month I closed a small deal — the kind that doesn't make it into a Twitter thread, just pays for a year of rent. A clinical research lab is now paying me to maintain the synthetic data tool I built on weekends. The contract started two years after the first commit.",
      },
      {
        heading: "The market nobody tells you about",
        text: "Indie hacker advice splits into two buckets: chase consumers, or chase B2B SaaS. There's a third: institutions that have a budget line for 'things we'd otherwise hire an engineer to do.' Research labs, government agencies, university clusters. They move at the speed of procurement — slow — but once you're in a line item, you stay. They don't churn because switching costs them a six-month purchasing cycle.",
      },
      {
        heading: "Open-source was the funnel",
        text: "The lab found the repo. They tried it. They hit a wall. They emailed me. None of this would have happened if I'd shipped it behind a landing page. Open source is a tax on your funnel efficiency but a multiplier on its trust. For dev tools sold to engineers, trust is the whole moat — features are copyable in a weekend.",
      },
      {
        heading: "What I'd do differently",
        text: "Charge earlier. I gave away six months of free support before signing anyone. The hard no — 'I'll do this for $X' — is what converts a friendly researcher into a paying customer. They were waiting for me to ask. The other thing: get a real lawyer for the contract, not a template. The template cost me a clause about uncapped liability that we renegotiated under deadline pressure, expensively.",
      },
    ],
  },
  {
    slug: "we-built-a-real-time-dashboard-without-redux",
    title: "10k Events/Sec in the Browser With No State Library",
    date: "2026-04-14",
    description: "How Flux streams 10k rows/second to the DOM at sub-50ms render, using WebSockets, a wasm aggregator, and exactly zero global state stores.",
    readingTime: "9 min",
    tags: ["React", "Performance", "Wasm"],
    body: [
      {
        text: "Flux pushes 10,000 events per second to a browser tab and stays interactive. No Redux, no Zustand, no recoil, no MobX. The trick isn't a hot state library — it's avoiding state altogether for the hot path.",
      },
      {
        heading: "The hot path doesn't go through React",
        text: "Every event arrives on a single WebSocket. It's pushed straight into a wasm ring buffer that does the rolling aggregations (P50/P95/P99 over 1m, 5m, 30m) and writes the result into a Float32Array shared with the renderer. React never sees the events. React sees one state update per second: 'new aggregation tick is ready.' The chart reads the shared array directly off requestAnimationFrame.",
      },
      {
        heading: "Why this works",
        text: "The bottleneck in dashboards is rarely the network or the SVG — it's rerendering. If every event triggers a reconciliation, you're done at ~200 events/second regardless of how clever your memoization is. By treating the streaming data as a side channel and giving the renderer direct memory access, the React tree only re-renders when a human's perception of the data changes — i.e., about once a second, slow enough that the diff cost is invisible.",
      },
      {
        heading: "The wasm kernel is <400 lines",
        text: "Rust, compiled with --target wasm32-unknown-unknown, no_std except for the bits that touch the SharedArrayBuffer. Rollups are branchless where I could make them branchless. The kernel ships at 38 kB. The whole dashboard bundle is 94 kB. I'm not saying everyone should write wasm — I'm saying when your problem is 'transform 10k items/sec before anyone sees them,' wasm is the right tool and React isn't.",
      },
    ],
  },
{
    slug: "claude-code-v2-1-212-anthropic-finally-admits-agents-run-away",
    title: "Claude Code v2.1.212: Anthropic Finally Admits Agents Run Away",
    date: "2026-07-17",
    description: "Anthropic's latest Claude Code update ships hard session caps on WebSearch, subagent spawns, and Bash calls. Here's what changed, why it matters, and how to use the new /fork and /subtask commands before your next $400 bill.",
    readingTime: "6 min",
    tags: ["AI", "Claude Code", "Dev Tools"],
    body: [
      {
        text: "Claude Code v2.1.212 landed yesterday (Jul 16, 2026) and it's the first update in months where Anthropic isn't shipping features — it's shipping guardrails. Three new session-wide caps, a rethink of how /fork works, and a new /subtask command. If you use Claude Code for any real work, you should update right now and set the caps before your next runaway session.",
      },
      {
        heading: "Hard caps on runaway loops",
        text: "Three new environment variables, three new defaults. WebSearch calls per session: 200 (CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION). Subagent spawns per session: 200 (CLAUDE_CODE_MAX_SUBAGENTS_PER_SESSION). Bash executions: similar limit. If your agent falls into a search loop, it now hits a wall at 200 calls and stops. No more $400 overnight surprises.",
      },
      {
        heading: "/fork is now a real background session",
        text: "/fork used to launch an in-session subagent. Now it copies your conversation into a new background session — its own row in 'claude agents' — and you keep working in the original. The in-session subagent it used to launch is now /subtask.",
      },
      {
        heading: "Why this matters",
        text: "A 755-point HN thread documented Claude Code Max users burning through their entire quota in 1.5 hours. A separate 50-day postmortem traced declining quality to three self-inflicted bugs. This is Anthropic's first public admission that runaway agents are a real problem and the fix is on them.",
      },
      {
        heading: "What you should do today",
        text: "Update: npm install -g @anthropic-ai/claude-code@latest. Tighten caps: export CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION=50. Try the new /fork. Then check 'claude agents' — your forked session appears with its own row, ready to /resume.",
      },
    ],
  },
{
    slug: "claude-code-can-now-click-its-own-buttons",
    title: "Claude Code Can Now Click Its Own Buttons",
    date: "2026-07-18",
    description: "Anthropic shipped computer use inside Claude Code's CLI. Claude can write Swift, compile it, launch the app, click every button, catch a visual bug, fix it, and re-verify — without you touching the mouse.",
    readingTime: "6 min",
    tags: ["AI", "Claude Code", "Computer Use"],
    body: [
      {
        text: "Anthropic just shipped computer use inside Claude Code's CLI. Claude can now open apps, click UI elements, type, scroll, and navigate macOS — then use what it sees to verify the code it just wrote actually works. It's a research preview on macOS for Pro and Max plans, announced via Claude's X account and covered by Augmenter, Recaply, and AI Toast.",
      },
      {
        heading: "What it actually does",
        text: "The killer demo: you ask Claude to build a macOS menu bar app. It writes the Swift, compiles it, launches the app, then clicks through every control to verify it works — all before you ever open it. If a button is misaligned or a checkbox doesn't toggle, Claude sees the visual bug, fixes the code, recompiles, and re-verifies. Loop closed. Every 'AI built me an app' demo used to end at 'npm run build'. This one ends at 'and then I watched it click its own buttons to confirm the checkbox actually toggles.' That's a different category of demo.",
      },
      {
        heading: "Why this is a real shift",
        text: "Up until yesterday, AI coding agents had two ways of testing what they built. Run a headless test suite — fast, but tests only check what you wrote assertions for; if you forgot to assert the checkbox state, you don't catch the bug. Or print screenshots and ask the human — Claude would emit a screenshot, you'd eyeball it, you'd tell it what's wrong. Slow, breaks flow, and forces you to be the visual regression detector. Computer use is a third option: Claude looks at the rendered UI itself, decides what's broken, fixes it, and re-checks. The loop closes without you. For indie devs shipping native Mac apps — menubar utilities, Preference Panes, SwiftUI toys — this is the first time 'vibe-coded' doesn't mean 'I hope it works.'",
      },
      {
        heading: "What it's actually useful for today",
        text: "Native macOS menu bar apps — the demo case. Small surface area, fast compile, easy to verify visually. Electron / Tauri apps — same loop: build, launch, click through every nav route, screenshot, decide. Regression testing — point Claude at your existing macOS app and ask 'does the export flow still work?' Claude opens it, walks through the menu, reports back. QA on the GUI side of a CLI tool — most CLIs ship with a tiny companion GUI; Claude can now verify both halves.",
      },
      {
        heading: "Where it breaks",
        text: "Web apps — the research preview is macOS only. To test a web app you'd need Claude to drive a browser, which means playwright or similar. Anthropic said browser support is 'coming', but today's preview is desktop. Anything requiring real keystrokes inside another app's text field — Claude can type, but apps with complex input handling (Adobe, Figma, audio editors) still misbehave. Animations and video output — computer use sees screenshots at intervals, so bugs that only manifest mid-animation are invisible. Permission fatigue — Claude asks for approval every time it opens a new app or clicks something sensitive; you'll say 'yes' 30 times in a 10-minute session. Cross-agent budget problem still unsolved — this is happening on Anthropic's billable tokens.",
      },
      {
        heading: "How to use it today",
        text: "Update Claude Code: npm install -g @anthropic-ai/claude-code@latest. Be on Pro or Max plan (research preview gate). Be on macOS (Windows/Linux not supported yet). In a session: 'claude build me a menubar app that shows my CalDAV events for today' — Claude will write Swift, compile, launch, click through, and report. You'll be prompted to grant Claude access to control each app it opens.",
      },
      {
        heading: "Reading the tea leaves",
        text: "Anthropic shipping this as a CLI feature rather than a separate product is the tell. They don't want a separate 'Claude Computer Use' app — they want every Claude Code user to think of the screen as just another tool the agent can call. That puts pressure on Cursor, Codex CLI, and every other coding agent to either ship their own computer use or get comfortable being 'the one that can't click.' Cursor's advantage was always that it lived inside your editor. Claude Code's new advantage is that it lives inside your terminal but can leave it. Different bet on what 'the agent's home base' looks like. My guess: in three months, every coding agent will have computer use. In six months, the ones that don't will be dead. The interesting fight is going to be about which agent's computer use is the most reliable — and on that front, Anthropic has a multi-year head start because they've been training computer-use models since the original Claude 3.5 Sonnet release in late 2024. For now, if you build native macOS apps for a living, the math just changed. Go try it.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
