"use client";

import Link from "next/link";
import { OpenWorkMark } from "./openwork-mark";
import { SectionWrapper } from "./ui/section-wrapper";
import { ThemeSwitcher } from "./ui/theme-switcher";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const footerColumns: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: "Product",
    links: [
      { label: "Intake", href: "/#intake" },
      { label: "Plan", href: "/#plan" },
      { label: "Build", href: "/#build" },
      { label: "Diffs", href: "/#diffs" },
      { label: "Monitor", href: "/#monitor" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security", href: "/trust" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Asks", href: "/#demo" },
      { label: "Agents", href: "/#demo" },
      { label: "Customer Requests", href: "/#demo" },
      { label: "Insights", href: "/#demo" },
      { label: "Mobile", href: "/#mobile-signup" },
      { label: "Integrations", href: "/#integrations" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/enterprise" },
      { label: "Customers", href: "/enterprise" },
      { label: "Careers", href: "/enterprise#book" },
      { label: "Blog", href: "/changelog" },
      { label: "Method", href: "/#demo" },
      { label: "Quality", href: "/trust" },
      { label: "Brand", href: "/enterprise" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Switch", href: "/enterprise" },
      { label: "Download", href: "/download" },
      { label: "Documentation", href: "/docs", external: true },
      { label: "Developers", href: "/docs", external: true },
      { label: "Status", href: "/trust" },
      { label: "Enterprise", href: "/enterprise" },
      { label: "Startups", href: "/pricing" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact us", href: "/enterprise#book" },
      {
        label: "Community",
        href: "https://github.com/different-ai/openwork",
        external: true,
      },
      { label: "X (Twitter)", href: "https://x.com", external: true },
      {
        label: "GitHub",
        href: "https://github.com/different-ai/openwork",
        external: true,
      },
    ],
  },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "DPA", href: "/trust" },
];

function FooterLinkItem(link: FooterLink) {
  const className = "text-[15px] text-[#8f95a3]";

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export function Footer() {
  return (
    <>
      <SectionWrapper position="top">
        <footer className="relative px-4">
          <div className="hidden md:grid md:grid-cols-[140px_repeat(5,minmax(0,1fr))] md:gap-x-10 p-4 py-24">
            <div className="pt-1">
              <OpenWorkMark className="h-6 w-6 opacity-90" />
            </div>

            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-3">
                <h3 className="tracking-tight">{column.title}</h3>
                <div className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <FooterLinkItem key={link.label} {...link} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* mobile menu */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-8  px-4 py-12 md:hidden">
            {[...footerColumns, { title: "Legal", links: legalLinks }].map(
              (column) => (
                <div key={column.title} className="space-y-2.5">
                  <h3 className="text-[1rem] tracking-tight">{column.title}</h3>
                  <div className="flex flex-col gap-1.5">
                    {column.links.map((link) => (
                      <FooterLinkItem
                        key={`${column.title}-${link.label}`}
                        {...link}
                      />
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </footer>
      </SectionWrapper>

      <SectionWrapper position="middle">
        <div className="flex items-center justify-between p-4">
          <div className="gap-4 flex items-center justify-between">
            {legalLinks.map((link) => (
              <FooterLinkItem key={`legal-${link.label}`} {...link} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-1">
            <ThemeSwitcher />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
