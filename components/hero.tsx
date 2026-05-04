import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/ui/section-wrapper";

type LinkProps = { rel: string; target: "_blank" } | Record<string, never>;

type Props = {
  primaryCtaHref: string;
  primaryCtaLabel: string;
  primaryCtaLinkProps: LinkProps;
  callHref: string;
  callLinkProps: LinkProps;
};

export function Hero(props: Props) {
  return (
    <SectionWrapper position="middle">
      <section className="px-2 py-16 md:py-24 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-10">
          <div>
            <h1 className="text-4xl font-normal leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-5xl">
              The open source
              <br />
              Claude Cowork
              <br />
              <span className="text-muted-foreground">for your team</span>
            </h1>
          </div>

          <div>
            <p className="max-w-xl leading-relaxed text-muted-foreground md:text-xl lg:pt-2">
              OpenWork is the desktop app that lets you use 50+ LLMs, bring
              your own keys, and share your setups seamlessly with your team.
            </p>

            <div className="mt-10 flex items-center gap-2">
              <a href={props.primaryCtaHref} {...props.primaryCtaLinkProps}>
                <Button size="lg" className="w-full sm:w-auto">
                  {props.primaryCtaLabel}
                </Button>
              </a>
              <a href={props.callHref} {...props.callLinkProps}>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Contact sales
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
}
