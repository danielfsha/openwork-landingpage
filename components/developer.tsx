"use client";

import { Button } from "./ui/button";
import { CodeSnippet } from "./ui/code-snippet";
import { CornerDecoration } from "./ui/corner-decoration";
import { SectionWrapper } from "./ui/section-wrapper";

const developerSnippet = `export async function updateMemberRole(
  memberId: string,
  role: string,
): Promise<boolean> {
  const res = await fetch(
    \`https://api.openworklabs.com/v1/members/\${memberId}/role\`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    },
  );

  if (!res.ok) return false;
  return ((await res.json()) as { success: boolean }).success;
}`;

export function DeveloperSection() {
  return (
    <SectionWrapper position="middle">
      <section className="py-16 md:py-24">
        <div className="mx-auto grid items-start lg:grid-cols-2">
          <div className="space-y-5 px-4 py-12 lg:px-12">
            <h2 className="text-3xl font-normal leading-[1.14] tracking-tight text-foreground md:text-4xl">
              Easy to start, extensible by design, and friendly to developers.
            </h2>
            <p className="max-w-xl text-[1.02rem] leading-relaxed text-muted-foreground md:text-lg">
              Use familiar TypeScript patterns on day one, then grow into custom
              tools, MCP servers, and deeper workflows as your product evolves.
            </p>
            <Button size="lg" className="w-full sm:w-auto">
              Read the docs
            </Button>
          </div>

          <div className="relative overflow-hidden border border-foreground/10 bg-background">
            <CornerDecoration position="top-left" />
            <CornerDecoration position="top-right" />
            <CornerDecoration position="bottom-left" />
            <CornerDecoration position="bottom-right" />
            <CodeSnippet
              code={developerSnippet}
              language="typescript"
              showLineNumbers
              //   highlightedLines={[5, 8, 13, 14]}
              className="border-0 bg-transparent"
            />
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
}
