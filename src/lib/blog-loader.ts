import fs from "node:fs";
import path from "node:path";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: string;
  tags: string[];
  coverImage?: string;
  body: string; // raw markdown body (without frontmatter)
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// --- Minimal frontmatter parser (YAML subset: key: value, arrays as comma list or YAML list) ---

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, content: raw };
  const yaml = match[1];
  const content = match[2] ?? "";
  const data: Record<string, unknown> = {};
  let currentKey: string | null = null;

  for (const line of yaml.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    // list item: "  - tag"
    if (/^\s*-\s+/.test(line) && currentKey) {
      const val = line.replace(/^\s*-\s+/, "").trim().replace(/^["']|["']$/g, "");
      const arr = (data[currentKey] as unknown[] | undefined) ?? [];
      arr.push(val);
      data[currentKey] = arr;
      continue;
    }
    const kv = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line);
    if (!kv) continue;
    const key = kv[1];
    let value: string = kv[2].trim();
    // inline array [a, b, c]
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      currentKey = key;
      continue;
    }
    value = value.replace(/^["']|["']$/g, "");
    data[key] = value;
    currentKey = key;
  }
  return { data, content };
}

function readingTimeFromMarkdown(md: string): string {
  const words = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const min = Math.max(1, Math.round(words / 200));
  return `${min} min`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inline(s: string): string {
  // images ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) =>
    `<img src="${url}" alt="${escapeHtml(alt)}" loading="lazy" />`
  );
  // links [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
    `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
  );
  // bold **text**
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italic *text*
  s = s.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  // inline code `code`
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  return s;
}

// Convert markdown body to an HTML string.
export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let i = 0;
  let inUl = false;
  let inOl = false;
  let inList = false;

  const closeList = () => {
    if (inUl) { html += "</ul>"; inUl = false; }
    if (inOl) { html += "</ol>"; inOl = false; }
    inList = false;
  };

  while (i < lines.length) {
    let line = lines[i];

    // fenced code block
    if (/^```/.test(line)) {
      closeList();
      const lang = line.replace(/^```/, "").trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      html += `<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(buf.join("\n"))}</code></pre>`;
      continue;
    }

    // horizontal rule
    if (/^\s*---\s*$/.test(line) || /^\s*\*\*\*\s*$/.test(line)) {
      closeList();
      html += "<hr />";
      i++;
      continue;
    }

    // headings
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      closeList();
      const level = h[1].length;
      html += `<h${level}>${inline(escapeHtml(h[2]))}</h${level}>`;
      i++;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      closeList();
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html += `<blockquote>${inline(escapeHtml(buf.join(" ")))}</blockquote>`;
      continue;
    }

    // table (GitHub-style)
    if (/^\s*\|.+\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|[\s\-|:]+\|\s*$/.test(lines[i + 1])) {
      closeList();
      const header = line.split("|").slice(1, -1).map((c) => c.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|.+\|\s*$/.test(lines[i])) {
        rows.push(lines[i].split("|").slice(1, -1).map((c) => c.trim()));
        i++;
      }
      html += "<table><thead><tr>" + header.map((c) => `<th>${inline(escapeHtml(c))}</th>`).join("") + "</tr></thead><tbody>";
      for (const row of rows) {
        html += "<tr>" + row.map((c) => `<td>${inline(escapeHtml(c))}</td>`).join("") + "</tr>";
      }
      html += "</tbody></table>";
      continue;
    }

    // ordered list item
    if (/^\s*\d+\.\s+/.test(line)) {
      if (!inOl) { closeList(); html += "<ol>"; inOl = true; inList = true; }
      html += `<li>${inline(escapeHtml(line.replace(/^\s*\d+\.\s+/, "")))}</li>`;
      i++;
      continue;
    }

    // unordered list item
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inUl) { closeList(); html += "<ul>"; inUl = true; inList = true; }
      html += `<li>${inline(escapeHtml(line.replace(/^\s*[-*]\s+/, "")))}</li>`;
      i++;
      continue;
    }

    // blank line
    if (!line.trim()) {
      closeList();
      i++;
      continue;
    }

    // paragraph (collect consecutive non-blank, non-special lines)
    closeList();
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^```/.test(lines[i]) &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^\s*\|.+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    html += `<p>${inline(escapeHtml(buf.join(" ")))}</p>`;
  }
  closeList();
  return html;
}

function loadFile(filePath: string, slug: string): BlogPost | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = parseFrontmatter(raw);

  const tags = Array.isArray(data.tags)
    ? data.tags.map((t: unknown) => String(t))
    : typeof data.tags === "string"
    ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    description: String(data.description ?? ""),
    readingTime: String(data.readingTime ?? readingTimeFromMarkdown(content)),
    tags,
    coverImage: data.image ? String(data.image) : undefined,
    body: content.trim(),
  };
}

function readAllFromDisk(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const entries = fs.readdirSync(BLOG_DIR);
  const posts: BlogPost[] = [];
  for (const entry of entries) {
    if (!/\.(md|mdx)$/i.test(entry)) continue;
    const slug = entry.replace(/\.(md|mdx)$/i, "");
    try {
      const post = loadFile(path.join(BLOG_DIR, entry), slug);
      if (post) posts.push(post);
    } catch {
      // skip broken/empty file
    }
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

let _cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (_cache === null) {
    _cache = readAllFromDisk();
  }
  return _cache;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
