"use client";

import { motion } from "motion/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useMeasure } from "@/hooks/use-measure";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import {
  type NavMenuItem,
  productItems,
  resourceItems,
  topLevelNavItems,
} from "@/lib/site-nav-links";

type MobileNavItem = {
  href: string;
  label: string;
  key: "pricing" | "download" | "enterprise" | "cloud";
  newTab?: boolean;
};

export type SiteNavActiveItem = MobileNavItem["key"] | "docs" | "home";

type SiteNavMobileMenuProps = {
  open: boolean;
  active?: SiteNavActiveItem;
  callHref: string;
  callExternal: boolean;
  primaryHref: string;
  primaryLabel: string;
  primaryExternal: boolean;
  onClose: () => void;
};

type ExpandableGroupProps = {
  label: string;
  items: NavMenuItem[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
};

const mobileNavItems: MobileNavItem[] = topLevelNavItems.map((item) => ({
  href: item.href,
  label: item.label,
  key: item.key,
}));

const expandableGroups = [
  { key: "product" as const, label: "Product", items: productItems },
  { key: "resources" as const, label: "Resources", items: resourceItems },
];

function opensInNewTab(item: MobileNavItem) {
  return item.newTab || /^(?:https?:\/\/)/.test(item.href);
}

function navLinkClass(isActive: boolean) {
  return isActive
    ? "text-[#111111]"
    : "text-[#111111] transition-colors hover:text-[#111111]";
}

function ExpandableGroup({
  label,
  items,
  open,
  onToggle,
  onClose,
}: ExpandableGroupProps) {
  const [contentRef, bounds] = useMeasure<HTMLDivElement>();

  return (
    <div className="rounded-xl">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[#111111]"
      >
        <span>{label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open ? "rotate-180" : "rotate-0",
          )}
        />
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? bounds.height : 0, opacity: open ? 1 : 0 }}
        transition={{
          height: { type: "spring", damping: 30, stiffness: 430, mass: 0.32 },
          opacity: { duration: 0.04, ease: "easeOut" },
        }}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="space-y-1 px-2 pb-2">
          {items.map((item) => {
            const isExternal =
              item.external || /^(?:https?:\/\/)/.test(item.href);

            return (
              <Link
                key={item.title}
                href={item.href}
                {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
                className="block rounded-lg px-3 py-2"
                onClick={onClose}
              >
                <div className="text-[17px] leading-tight text-[#111111]">
                  {item.title}
                </div>
                {item.description ? (
                  <p className="mt-1 text-sm leading-snug text-[#111111]">
                    {item.description}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

export function SiteNavMobileMenu({
  open,
  active,
  callHref,
  callExternal,
  primaryHref,
  primaryLabel,
  primaryExternal,
  onClose,
}: SiteNavMobileMenuProps) {
  const [expanded, setExpanded] = useState<
    Record<"product" | "resources", boolean>
  >({
    product: true,
    resources: false,
  });

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[30] md:hidden ">
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col px-3 pb-3 pt-[82px]">
        <div className="flex flex-1 flex-col overflow-hidden rounded-[22px] bg-[#F5F3F1] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_0px_rgba(0,0,0,0.04),0_2px_4px_0px_rgba(0,0,0,0.04)]">
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1 text-[20px] font-medium tracking-tight text-[#111111]">
              {expandableGroups.map((group) => {
                const isOpen = expanded[group.key];

                return (
                  <ExpandableGroup
                    key={group.key}
                    label={group.label}
                    items={group.items}
                    open={isOpen}
                    onToggle={() =>
                      setExpanded((current) => ({
                        ...current,
                        [group.key]: !current[group.key],
                      }))
                    }
                    onClose={onClose}
                  />
                );
              })}

              {mobileNavItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  {...(opensInNewTab(item)
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3",
                    navLinkClass(active === item.key),
                  )}
                  onClick={onClose}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          <div className="p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={callHref}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 justify-center rounded-full border-[#e5e5e5] bg-white text-[#111111] shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_0px_rgba(0,0,0,0.04),0_2px_4px_0px_rgba(0,0,0,0.04)] hover:bg-[#f5f5f5] hover:text-[#111111] dark:border-[#e5e5e5] dark:bg-white dark:text-[#111111] dark:hover:bg-[#f5f5f5] dark:hover:text-[#111111]",
                )}
                rel={callExternal ? "noreferrer" : undefined}
                target={callExternal ? "_blank" : undefined}
              >
                Contact sales
              </a>
              <a
                href={primaryHref}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "h-11 justify-center rounded-full bg-[#212121] text-white hover:bg-[#171717] dark:bg-[#212121] dark:text-white dark:hover:bg-[#171717]",
                )}
                rel={primaryExternal ? "noreferrer" : undefined}
                target={primaryExternal ? "_blank" : undefined}
              >
                {primaryLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
