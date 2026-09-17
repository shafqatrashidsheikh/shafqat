import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  HeaderCtaMobileGroups,
  HeaderCtaPills,
} from "@/components/site/HeaderCtaPills";
import { HeaderAuthButtons } from "@/components/site/HeaderAuthButtons";
import { INSTITUTE, type HeaderCtaPill } from "@/lib/site-data";
import type { InstituteSettings } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { CollegeLogo } from "./CollegeLogo";

type HeaderProps = {
  institute?: InstituteSettings;
  headerNav?: HeaderCtaPill[];
};

const AFFILIATION_RING =
  "Recognised by the J&K Government • Approved by AICTE • Affiliated to the Jammu & Kashmir Board of Technical Education (JKBOTE) • ";

/** Street line under the college name — never include the institute name again. */
const HEADER_STREET_ADDRESS = "NH44 Bypass Road, Bemina, Srinagar, Jammu & Kashmir";

export function Header({ institute: _institute = INSTITUTE, headerNav }: HeaderProps) {
  const pills = headerNav ?? undefined;
  const orbitPathId = useId().replace(/:/g, "");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-[60] w-full min-w-0 bg-background px-3 pt-2 sm:px-4 sm:pt-2.5 lg:px-5">
      <div
        className={cn(
          "grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 overflow-visible rounded-2xl border border-border bg-surface-white px-3 shadow-soft transition-[box-shadow,padding] duration-300 sm:gap-4 sm:px-4 lg:gap-5 lg:px-5 xl:px-6",
          "py-2 sm:py-2.5 xl:py-3",
          scrolled && "shadow-raised",
        )}
      >
        {/* Logo — left */}
        <Link
          to="/"
          aria-label="Government Polytechnic for Women, Srinagar — Home"
          className="header-brand-seal shrink-0"
        >
          <span className="header-brand-seal-orbit" aria-hidden="true">
            <svg viewBox="0 0 160 160" className="h-full w-full overflow-visible">
              <defs>
                <path
                  id={orbitPathId}
                  d="M 80,80 m -66,0 a 66,66 0 1,1 132,0 a 66,66 0 1,1 -132,0"
                  fill="none"
                />
              </defs>
              <text className="header-brand-seal-orbit-text">
                <textPath href={`#${orbitPathId}`} startOffset="0%">
                  {AFFILIATION_RING}
                  {AFFILIATION_RING}
                </textPath>
              </text>
            </svg>
          </span>
          <CollegeLogo variant={scrolled ? "header-compact" : "header"} priority />
          <span className="sr-only">{AFFILIATION_RING.trim()}</span>
        </Link>

        {/* Name seed with nav buttons; address scrolls just under the name */}
        <Link
          to="/"
          className="header-brand-copy relative flex min-w-0 max-w-full items-center justify-center justify-self-center overflow-visible px-1 sm:px-2"
        >
          <span className="relative inline-flex max-w-full flex-col items-stretch text-center">
            <span className="font-brand relative z-[1] block whitespace-nowrap text-[clamp(1.05rem,0.55vw+0.9rem,1.45rem)] leading-none font-extrabold tracking-tight text-navy xl:text-[1.35rem] 2xl:text-[1.5rem]">
              Government Polytechnic for Women
            </span>
            <span className="header-address-marquee absolute top-[calc(100%+0.45rem)] right-0 left-0 z-0 min-w-0 sm:top-[calc(100%+0.5rem)]">
              <span className="sr-only">{HEADER_STREET_ADDRESS}</span>
              <span className="header-address-marquee-track" aria-hidden="true">
                <span className="header-address-marquee-set">
                  <span className="header-address-marquee-item">{HEADER_STREET_ADDRESS}</span>
                </span>
                <span className="header-address-marquee-set">
                  <span className="header-address-marquee-item">{HEADER_STREET_ADDRESS}</span>
                </span>
              </span>
            </span>
          </span>
        </Link>

        {/* Nav — right */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1.5 xl:flex 2xl:gap-2"
          >
            <HeaderCtaPills pills={pills} />
            <HeaderAuthButtons />
          </nav>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open menu"
                className="size-10 shrink-0 rounded-full border-border text-navy xl:hidden"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="z-[70] w-[min(100vw-1rem,20rem)] overflow-y-auto border-border bg-surface-white p-0"
            >
              <SheetTitle className="border-b border-border px-5 py-4 font-display text-base font-bold text-navy">
                Menu
              </SheetTitle>
              <HeaderCtaMobileGroups pills={pills} onNavigate={() => setOpen(false)} />
              <div className="border-t border-border px-4 py-4">
                <HeaderAuthButtons
                  className="w-full flex-col gap-2.5 [&>*]:w-full"
                  onNavigate={() => setOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
