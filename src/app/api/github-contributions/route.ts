import { NextResponse } from "next/server";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      avatarUrl
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
              weekday
            }
          }
          months {
            name
            year
            firstDay
          }
        }
      }
    }
  }
`;

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const login = process.env.GITHUB_LOGIN || "opisbin";

  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not configured" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "portfolio-contributions",
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const json = await res.json();
    const user = json?.data?.user;
    const calendar = user?.contributionsCollection?.contributionCalendar;

    if (!calendar || !user?.avatarUrl) {
      return NextResponse.json({ error: "No contribution data" }, { status: 500 });
    }

    return NextResponse.json(
      { ...calendar, avatarUrl: user.avatarUrl },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "fetch failed" }, { status: 500 });
  }
}
