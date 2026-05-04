export type NavMenuItem = {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
};

export const productItems: NavMenuItem[] = [
  {
    title: "Intake",
    href: "/#intake",
    description: "Make your product operations self-driving",
  },
  {
    title: "Plan",
    href: "/#plan",
    description: "Plan and navigate from idea to launch",
  },
  {
    title: "Build",
    href: "/#build",
    description: "Move work forward across teams and agents",
  },
  {
    title: "Diffs",
    href: "/#diffs",
    description: "Make code review effortless",
  },
  {
    title: "Monitor",
    href: "/#monitor",
    description: "Understand progress at scale",
  },
  {
    title: "Integrations",
    href: "/#integrations",
    description: "Collaborate across tools",
  },
];

export const resourceItems: NavMenuItem[] = [
  {
    title: "Documentation",
    href: "/docs",
    description: "Learn how to use OpenWork",
    external: true,
  },
  {
    title: "GitHub",
    href: "https://github.com/different-ai/openwork",
    description: "View source and contribute",
    external: true,
  },
  {
    title: "Changelog",
    href: "/changelog",
    description: "See what's new",
  },
];

export const topLevelNavItems = [
  { href: "/pricing", label: "Pricing", key: "pricing" as const },
  { href: "/download", label: "Desktop", key: "download" as const },
  {
    href: "https://app.openworklabs.com",
    label: "Cloud",
    key: "cloud" as const,
  },
  { href: "/enterprise", label: "Enterprise", key: "enterprise" as const },
];
