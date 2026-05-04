import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  metadataBase: new URL("https://openworklabs.com"),
  title: "OpenWork — Open source Claude Cowork alternative for teams",
  description:
    "Bring your own model and provider, wire in your tools and context, and ship reusable agent setups across your org — with guardrails built in.",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "OpenWork",
    locale: "en_US",
    images: ["/og-image-clean.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image-clean.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full overflow-x-hidden", "antialiased", inter.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
         <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
        {children}
        </ThemeProvider>
        </body>
    </html>
  );
}
