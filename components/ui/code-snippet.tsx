"use client";

import * as React from "react";
import { GeistMono } from "geist/font/mono";
import { Highlight } from "prism-react-renderer";
import type { Language, RenderProps, Token } from "prism-react-renderer";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useClipboard } from "@/hooks/use-clipboard";

type LineNumberConfig = boolean | "inside" | "outside";

type CodeSnippetProps = React.ComponentProps<"div"> & {
  code?: string;
  language?: string;
  showLineNumbers?: LineNumberConfig;
  highlightedLines?: number[];
  startLineNumber?: number;
  preClassName?: string;
  codeClassName?: string;
  children?: React.ReactNode;
};

function flattenNodeText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(flattenNodeText).join("");
  }

  if (React.isValidElement(node)) {
    return flattenNodeText(
      (node.props as { children?: React.ReactNode }).children,
    );
  }

  return "";
}

function extractSnippetFromChildren(children: React.ReactNode): {
  code: string;
  language?: string;
} {
  if (React.isValidElement(children) && children.type === "code") {
    const p = children.props as Record<string, unknown>;
    const className = typeof p?.className === "string" ? p.className : "";
    const languageMatch = className.match(/language-([a-zA-Z0-9_-]+)/);

    return {
      code: flattenNodeText(p?.children as React.ReactNode),
      language: languageMatch?.[1],
    };
  }

  return {
    code: flattenNodeText(children),
  };
}

function normalizeCodeText(rawCode: string): string {
  return rawCode.replace(/^\n+/, "").replace(/\s+$/, "");
}

function toPrismLanguage(language?: string): Language {
  const normalized = (language ?? "").toLowerCase();

  switch (normalized) {
    case "js":
    case "javascript":
      return "javascript";
    case "jsx":
      return "jsx";
    case "ts":
    case "typescript":
      return "typescript";
    case "tsx":
      return "tsx";
    case "json":
      return "json";
    case "bash":
    case "sh":
    case "shell":
      return "bash";
    case "css":
      return "css";
    case "html":
      return "html";
    case "md":
    case "markdown":
      return "markdown";
    case "yaml":
    case "yml":
      return "yaml";
    default:
      return "tsx";
  }
}

import type { PrismTheme } from "prism-react-renderer";

/*
DARK THEME
Inspired by your screenshot:
- deep black background
- muted gray line numbers
- pink keywords
- cyan functions / variables
- warm yellow imports / strings
- soft green JSX tags
- subtle red highlighted lines
*/

export const premiumDarkTheme: PrismTheme = {
  plain: {
    color: "#E5E7EB",
    backgroundColor: "transparent",
  },

  styles: [
    {
      types: ["comment"],
      style: {
        color: "#6B7280",
        fontStyle: "italic",
      },
    },

    {
      types: ["keyword", "operator"],
      style: {
        color: "#F0527D",
      },
    },

    {
      types: ["string"],
      style: {
        color: "#FBBF24",
      },
    },

    {
      types: ["number", "boolean"],
      style: {
        color: "#F59E0B",
      },
    },

    {
      types: ["function", "method", "function-variable"],
      style: {
        color: "#A78BFA",
      },
    },

    {
      types: ["class-name", "constant"],
      style: {
        color: "#C084FC",
      },
    },

    {
      types: ["tag", "selector"],
      style: {
        color: "#4ADE80",
      },
    },

    {
      types: ["attr-name"],
      style: {
        color: "#86EFAC",
      },
    },

    {
      types: ["punctuation"],
      style: {
        color: "#9CA3AF",
      },
    },

    {
      types: ["property"],
      style: {
        color: "#22D3EE",
      },
    },

    {
      types: ["parameter", "variable", "symbol", "plain"],
      style: {
        color: "#E5E7EB",
      },
    },
  ],
};

/*
LIGHT THEME
Premium soft docs style:
- warm white background
- softer contrast
- same syntax language but adapted for light mode
*/

export const premiumLightTheme: PrismTheme = {
  plain: {
    color: "#111827",
    backgroundColor: "transparent",
  },

  styles: [
    {
      types: ["comment"],
      style: {
        color: "#9CA3AF",
        fontStyle: "italic",
      },
    },

    {
      types: ["keyword", "operator"],
      style: {
        color: "#D63D68",
      },
    },

    {
      types: ["string"],
      style: {
        color: "#D97706",
      },
    },

    {
      types: ["number", "boolean"],
      style: {
        color: "#B45309",
      },
    },

    {
      types: ["function", "method", "function-variable"],
      style: {
        color: "#7C3AED",
      },
    },

    {
      types: ["class-name", "constant"],
      style: {
        color: "#8B5CF6",
      },
    },

    {
      types: ["tag", "selector"],
      style: {
        color: "#16A34A",
      },
    },

    {
      types: ["attr-name"],
      style: {
        color: "#15803D",
      },
    },

    {
      types: ["punctuation"],
      style: {
        color: "#6B7280",
      },
    },

    {
      types: ["property"],
      style: {
        color: "#0891B2",
      },
    },

    {
      types: ["parameter", "variable", "symbol", "plain"],
      style: {
        color: "#111827",
      },
    },
  ],
};

export function CodeSnippet({
  className,
  code,
  language,
  showLineNumbers = true,
  highlightedLines,
  startLineNumber = 1,
  preClassName,
  codeClassName,
  children,
  ...props
}: CodeSnippetProps) {
  const { resolvedTheme } = useTheme();
  const [prefersDark, setPrefersDark] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const rootHasDarkClass =
      document.documentElement.classList.contains("dark");
    if (rootHasDarkClass) {
      setPrefersDark(true);
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updatePreference = () => setPrefersDark(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const extracted = extractSnippetFromChildren(children);
  const effectiveCode = normalizeCodeText(code ?? extracted.code);
  const effectiveLanguage = language ?? extracted.language;

  const prismLanguage = toPrismLanguage(effectiveLanguage);

  // IMPORTANT FIX:
  // use theme object ONLY for token colors
  // never override token inline styles with global font styles
  const isDarkMode =
    resolvedTheme === "dark" || (resolvedTheme == null && prefersDark);
  const prismTheme = isDarkMode ? premiumDarkTheme : premiumLightTheme;

  const highlightedSet = React.useMemo(
    () =>
      new Set((highlightedLines ?? []).filter((line) => Number.isFinite(line))),
    [highlightedLines],
  );
  const { copied, copy } = useClipboard({ resetAfterMs: 1800 });

  return (
    <div
      data-slot="code-snippet"
      className={cn(
        "relative overflow-hidden rounded-[14px] border border-foreground/10 bg-card text-card-foreground",
        className,
      )}
      {...props}
    >
      <div className="flex justify-end px-2 pt-2">
        <button
          type="button"
          className="z-20 inline-flex size-8 items-center justify-center border border-foreground/10 bg-background/80 text-foreground transition-colors hover:bg-background"
          onClick={() => copy(effectiveCode)}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={copied ? "check" : "copy"}
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
              {copied ? (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {
        Highlight({
          code: effectiveCode || " ",
          language: prismLanguage,
          theme: prismTheme,
          children: ({
            className: prismClassName,
            style,
            tokens,
            getLineProps,
            getTokenProps,
          }: RenderProps) => (
            <pre
              className={cn(
                prismClassName,
                GeistMono.className,
                "overflow-x-auto overflow-y-hidden bg-transparent p-0 pb-3 text-[13px] leading-5",
                preClassName,
              )}
              style={{
                ...style,
                backgroundColor: "transparent",
                fontFamily: GeistMono.style.fontFamily,
              }}
            >
              <code
                className={cn(
                  "grid min-w-full w-max",
                  GeistMono.className,
                  codeClassName,
                )}
              >
                {tokens.map((line: Token[], index: number) => {
                  const lineNumber = startLineNumber + index;
                  const formattedLineNumber = String(lineNumber).padStart(
                    2,
                    "0",
                  );
                  const isHighlighted = highlightedSet.has(lineNumber);

                  const lineProps = getLineProps({
                    line,
                    key: index,
                  });

                  return (
                    <span
                      {...lineProps}
                      key={`${lineNumber}-${index}`}
                      className={cn(
                        lineProps.className,
                        "group relative flex w-full items-start gap-3",
                        isHighlighted &&
                          "bg-orange-500/20 dark:bg-orange-400/16",
                      )}
                    >
                      {isHighlighted && (
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-0 h-full w-0.5 bg-orange-500/90"
                        />
                      )}

                      {showLineNumbers !== false && (
                        <span
                          className={cn(
                            "w-7 shrink-0 select-none text-right",
                            isHighlighted
                              ? "text-orange-600 dark:text-orange-300"
                              : "text-muted-foreground/70",
                            showLineNumbers === "inside" ? "" : "-ml-0.5",
                            GeistMono.className,
                          )}
                        >
                          {formattedLineNumber}
                        </span>
                      )}

                      <span className="whitespace-pre">
                        {line.length === 0
                          ? " "
                          : line.map((token: Token, tokenIndex: number) => {
                              const tokenProps = getTokenProps({
                                token,
                                key: tokenIndex,
                              });

                              return (
                                <span
                                  key={`${lineNumber}-${tokenIndex}`}
                                  {...tokenProps}
                                  className={cn(
                                    tokenProps.className,
                                    GeistMono.className,
                                  )}
                                />
                              );
                            })}
                      </span>
                    </span>
                  );
                })}
              </code>
            </pre>
          ),
        }) as unknown as React.ReactNode
      }
    </div>
  );
}
