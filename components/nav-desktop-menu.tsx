"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";
import { useNavHoverIndicator } from "../hooks/use-nav-hover-indicator";
import { productItems, resourceItems } from "@/lib/site-nav-links";

function ListItem({
  className,
  title,
  children,
  href,
  external,
  ...props
}: ComponentPropsWithoutRef<"li"> & {
  href: string;
  external?: boolean;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={cn(
          "block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className,
        )}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </NavigationMenuLink>
    </li>
  );
}

export function SiteNavDesktopMenu() {
  const {
    hoveredItem,
    hoverRect,
    navContainerRef,
    itemRefs,
    handleMouseEnter,
    handleMouseLeave,
  } = useNavHoverIndicator();

  return (
    <div
      ref={navContainerRef}
      className="relative hidden md:block"
      onMouseLeave={handleMouseLeave}
    >
      {hoveredItem ? (
        <motion.div
          initial={false}
          className="pointer-events-none absolute inset-y-[2px] z-0 rounded-full bg-black/10 dark:bg-white/10"
          animate={{
            left: hoverRect.left,
            width: hoverRect.width,
          }}
          transition={{
            type: "spring",
            bounce: 0.15,
            duration: 0.25,
          }}
        />
      ) : null}

      <NavigationMenu className="relative z-10">
        <NavigationMenuList>
          <NavigationMenuItem>
            <div
              ref={(el) => {
                if (el) itemRefs.current.set("product", el);
              }}
              onMouseEnter={() => handleMouseEnter("product")}
            >
              <NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-popup-open:bg-transparent">
                Product
              </NavigationMenuTrigger>
            </div>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-1 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {productItems.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <div
              ref={(el) => {
                if (el) itemRefs.current.set("resources", el);
              }}
              onMouseEnter={() => handleMouseEnter("resources")}
            >
              <NavigationMenuTrigger className="bg-transparent hover:bg-transparent data-popup-open:bg-transparent">
                Resources
              </NavigationMenuTrigger>
            </div>
            <NavigationMenuContent>
              <ul className="w-[300px]">
                {resourceItems.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    external={item.external}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <div
              ref={(el) => {
                if (el) itemRefs.current.set("pricing", el);
              }}
              onMouseEnter={() => handleMouseEnter("pricing")}
            >
              <NavigationMenuLink
                href="/pricing"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-transparent",
                )}
              >
                Pricing
              </NavigationMenuLink>
            </div>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <div
              ref={(el) => {
                if (el) itemRefs.current.set("download", el);
              }}
              onMouseEnter={() => handleMouseEnter("download")}
            >
              <NavigationMenuLink
                href="/download"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-transparent",
                )}
              >
                Desktop
              </NavigationMenuLink>
            </div>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <div
              ref={(el) => {
                if (el) itemRefs.current.set("cloud", el);
              }}
              onMouseEnter={() => handleMouseEnter("cloud")}
            >
              <NavigationMenuLink
                href="https://app.openworklabs.com"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-transparent",
                )}
              >
                Cloud
              </NavigationMenuLink>
            </div>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <div
              ref={(el) => {
                if (el) itemRefs.current.set("enterprise", el);
              }}
              onMouseEnter={() => handleMouseEnter("enterprise")}
            >
              <NavigationMenuLink
                href="/enterprise"
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-transparent",
                )}
              >
                Enterprise
              </NavigationMenuLink>
            </div>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
