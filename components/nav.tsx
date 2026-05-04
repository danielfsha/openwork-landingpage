"use client";

import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { cn } from "@/lib/utils";
import { OpenWorkMark } from "./openwork-mark";
import { SiteNavDesktopMenu } from "./nav-desktop-menu";
import {
  SiteNavMobileMenu,
  type SiteNavActiveItem,
} from "./nav-mobile-menu";
import { buttonVariants } from "./ui/button";

type Props = {
  stars: string;
  callUrl?: string;
  downloadHref?: string;
  mobilePrimaryHref?: string;
  mobilePrimaryLabel?: string;
  active?: SiteNavActiveItem;
};

export function Nav(props: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const nextY = window.scrollY;

      if (nextY < 12) {
        setNavVisible(true);
      } else if (nextY > lastScrollY.current + 2) {
        setNavVisible(false);
      } else if (nextY < lastScrollY.current - 2) {
        setNavVisible(true);
      }

      lastScrollY.current = nextY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      setNavVisible(true);
    }
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const callHref = props.callUrl || "/enterprise#book";
  const downloadHref = props.downloadHref || "/download";
  const downloadPageHref = "/download";
  const mobilePrimaryHref = props.mobilePrimaryHref || downloadHref;
  const mobilePrimaryLabel = props.mobilePrimaryLabel || "Desktop";
  const callExternal = /^https?:\/\//.test(callHref);
  const mobilePrimaryExternal = /^https?:\/\//.test(mobilePrimaryHref);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-screen transition-transform duration-150 ease-out will-change-transform bg-background",
          navVisible ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <SectionWrapper position="top" as="div">
          <div className="flex items-center justify-between px-2 py-4 md:px-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5"
              onClick={() => setMobileOpen(false)}
            >
              <OpenWorkMark className="h-[30px] w-[38px] transition-opacity group-hover:opacity-80" />
              <span className="text-[1.2rem] font-semibold tracking-tight text-foreground md:text-[1.3rem]">
                OpenWork
              </span>
            </Link>

            <SiteNavDesktopMenu />

            <div className="flex items-center gap-2">
              <a
                href="https://github.com/different-ai/openwork"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "default" }),
                  "hidden items-center gap-2 rounded-full text-muted-foreground sm:flex",
                )}
                rel="noreferrer"
                target="_blank"
                aria-label="OpenWork GitHub stars"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                {props.stars}
              </a>
              <Link
                href={downloadPageHref}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "!hidden items-center gap-2 md:!inline-flex",
                )}
              >
                Desktop
              </Link>
              <a
                href={callHref}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "hidden rounded-full px-3.5 md:hidden",
                )}
                rel={callExternal ? "noreferrer" : undefined}
                target={callExternal ? "_blank" : undefined}
              >
                Contact sales
              </a>

              <div className="flex items-center">
                <Link
                  href={downloadPageHref}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "inline-flex lg:hidden",
                  )}
                >
                  Desktop
                </Link>
                <button
                  type="button"
                  className="relative flex size-12 items-center justify-center rounded-full text-foreground md:hidden"
                  onClick={() => setMobileOpen((current) => !current)}
                  aria-expanded={mobileOpen}
                  aria-label={
                    mobileOpen
                      ? "Close navigation menu"
                      : "Open navigation menu"
                  }
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={mobileOpen ? "close" : "menu"}
                      initial={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
                      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                      exit={{ scale: 0, opacity: 0, filter: "blur(4px)" }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 400,
                        mass: 0.5,
                      }}
                    >
                      {mobileOpen ? (
                        <X className="h-6 w-6" />
                      ) : (
                        <Menu className="h-6 w-6" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </header>

      <SiteNavMobileMenu
        open={mobileOpen}
        active={props.active === "home" ? undefined : props.active}
        callHref={callHref}
        callExternal={callExternal}
        primaryHref={mobilePrimaryHref}
        primaryLabel={mobilePrimaryLabel}
        primaryExternal={mobilePrimaryExternal}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
