import { DeveloperSection } from "@/components/developer";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";

type Props = {
  stars: string;
  downloadHref: string;
  callHref: string;
  isMobileVisitor: boolean;
};

const externalLinkProps = (href: string): { rel: string; target: "_blank" } | {} =>
  /^https?:\/\//.test(href)
    ? { rel: "noreferrer", target: "_blank" as const }
    : {};

export default function Home(props: Props) {
  const callLinkProps = externalLinkProps(props.callHref);
  const primaryCtaHref = props.isMobileVisitor
    ? "https://app.openworklabs.com"
    : "/download";
  const primaryCtaLabel = props.isMobileVisitor ? "Open the app" : "Download for free";
  const primaryCtaLinkProps = props.isMobileVisitor
    ? {}
    : externalLinkProps(primaryCtaHref);

  return (
    <>
      <Nav
        stars={props.stars}
        downloadHref={props.downloadHref}
        callUrl={props.callHref}
        mobilePrimaryHref="https://app.openworklabs.com"
        mobilePrimaryLabel="Open app"
        active="home"
      />
      <Hero
        primaryCtaHref={primaryCtaHref}
        primaryCtaLabel={primaryCtaLabel}
        primaryCtaLinkProps={primaryCtaLinkProps}
        callHref={props.callHref}
        callLinkProps={callLinkProps}
      />
      <Features />
      <DeveloperSection />
      <Footer />
    </>
  );
}
