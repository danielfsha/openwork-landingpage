"use client";

import { SectionWrapper } from "@/components/ui/section-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { CornerDecoration } from "./ui/corner-decoration";

const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "What is OpenWork?",
        answer:
          "OpenWork is an open-source desktop app that serves as an alternative to Claude Cowork, enabling teams to use 50+ LLMs with their own keys and share setups seamlessly.",
      },
      {
        question: "What can I build with OpenWork?",
        answer:
          "You can build agentic workflows, browser automation tasks, data extraction tools, and team-shared AI setups for tasks like social media interactions and file management.",
      },
      {
        question: "Why choose OpenWork for teams?",
        answer:
          "OpenWork allows BYOK (bring your own keys), local execution, and one-click sharing of skills, MCPs, plugins, and configs without vendor lock-in or privacy risks.",
      },
      {
        question: "What are key features?",
        answer:
          "Features include browser automation (e.g., liking tweets, extracting data to CSV), LLM integration with 50+ providers, task execution timelines, and enterprise self-hosting.",
      },
      {
        question: "Does OpenWork support browser automation?",
        answer:
          "Yes, it turns plain-language requests into browser actions, such as navigating URLs, scrolling threads, interacting with elements, and saving data locally.",
      },
      {
        question: "Who uses OpenWork?",
        answer:
          "Developers, AI teams, enterprises, and sales teams use it for outreach, data analysis, and automating repetitive web-based tasks.",
      },
      {
        question: "Is OpenWork open-source?",
        answer:
          "Yes, OpenWork is fully open-source (MIT license) with 14.4K GitHub stars, available at github.com/different-ai/openwork.",
      },
      {
        question: "How is OpenWork different from closed-source tools?",
        answer:
          "Unlike proprietary tools, OpenWork runs locally/on your servers, supports any LLM provider, and enables full customization and team sharing via links.",
      },
      {
        question: "What deployment options exist?",
        answer:
          "Options include free desktop app, OpenWork Cloud for teams, and Enterprise for private deployments with support.",
      },
    ],
  },
  {
    category: "Integrations",
    questions: [
      {
        question: "What LLMs are supported?",
        answer:
          "OpenWork supports 50+ LLM providers; bring your own keys for ChatGPT, Claude, or others, with easy connection.",
      },
      {
        question: "What are MCPs and skills?",
        answer:
          "MCPs (Model Context Protocols) are custom servers for context/tools; skills are reusable workflows shared via links.",
      },
      {
        question: "Does it integrate with browsers?",
        answer:
          "Yes, it controls Chrome for tasks like navigating, scrolling, clicking, and data extraction with screenshots.",
      },
    ],
  },
  // {
  //   category: "Pricing & Billing",
  //   questions: [
  //     {
  //       question: "Is OpenWork free?",
  //       answer:
  //         "The desktop app and core features are free and open-source; Cloud and Enterprise have paid plans.",
  //     },
  //     {
  //       question: "What are the pricing options?",
  //       answer:
  //         "Free desktop download; Cloud for shared workspaces; Enterprise for custom deployments—see pricing page.",
  //     },
  //     {
  //       question: "Is there enterprise support?",
  //       answer:
  //         "Yes, Enterprise offers private servers, no telemetry, and dedicated support; contact sales.",
  //     },
  //   ],
  // },
];

export default function SiteFAQ() {
  return (
    <SectionWrapper position="middle" className="bg-background">
      {faqData.map((category, idx) => (
        <div key={idx}>
          <div className="flex flex-col space-y-[-1] space-x-[-1]">
            {/* Category title on the left */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 space-x-[-2] space-y-[-1]">
              <div className="flex-1 relative">
                <>
                  <CornerDecoration position="top-left" />
                  <CornerDecoration position="top-right" />
                  <CornerDecoration position="bottom-left" />
                  <CornerDecoration position="bottom-right" />
                </>
                <h3 className="text-2xl lg:text-3xl font-medium p-6 ">
                  {category.category}
                </h3>
              </div>
              <Card showCorners className="hidden lg:block bg-transparent">
                <CardContent></CardContent>
              </Card>
            </div>

            {/* Questions on the right */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 space-x-[-2] space-y-[-2]">
              <Card showCorners className="hidden lg:block bg-transparent">
                <CardContent></CardContent>
              </Card>
              <div className="space-y-[-1] space-x-[-1]">
                <Accordion className={"space-y-[-1]"}>
                  {category.questions.map((item, qIdx) => (
                    <div
                      className="relative p-0.5 px-4 bg-transparent border-b-[0.5px] last:border-b-0"
                      key={qIdx}
                    >
                      <>
                        <CornerDecoration position="top-left" />
                        <CornerDecoration position="top-right" />
                        <CornerDecoration position="bottom-left" />
                        <CornerDecoration position="bottom-right" />
                      </>
                      <AccordionItem value={`${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-base">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      ))}
    </SectionWrapper>
  );
}
