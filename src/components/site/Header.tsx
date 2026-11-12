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

const LOGO_SEAL_TEXT =
  "Empowering women through quality technical education, practical learning and career-focused skills • ";

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
    <header
      className={cn(
        "site-header sticky top-0 z-[60] w-full min-w-0 transition-all duration-300 ease-out xl:overflow-visible",
        scrolled
          ? "bg-surface-white/98 backdrop-blur-md border-b border-border/80 shadow-sm"
          : "bg-transparent border-b border-transparent shadow-none",
      )}
    >
      <div
        className={cn(
          "container-page flex w-full min-w-0 items-center justify-between gap-3 transition-[padding] duration-300 sm:gap-4 lg:gap-5 xl:overflow-visible",
          scrolled ? "py-2 sm:py-2.5 xl:py-2.5" : "py-2.5 sm:py-3 xl:py-3.5",
        )}
      >
        {/* Official brand lockup (MVJCE layout) — crest with rotating seal orbit + structured institutional typography */}
        <Link
          to="/"
          aria-label="Government Polytechnic for Women, Srinagar — Home"
          className="group flex min-w-0 items-center gap-2.5 sm:gap-3.5 lg:gap-4 py-0.5 select-none"
        >
          {/* Official Emblem / Crest with rotating seal orbit */}
          <div className="header-brand-seal shrink-0">
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
                    {LOGO_SEAL_TEXT}
                  </textPath>
                </text>
              </svg>
            </span>
            <CollegeLogo variant={scrolled ? "header-compact" : "header"} priority />
            <span className="sr-only">{LOGO_SEAL_TEXT.trim()}</span>
          </div>

          {/* Institutional Typography — Name & Since 1986 in uniform color */}
          <div className="flex min-w-0 flex-col justify-center">
            <span className="font-brand text-[12px] min-[390px]:text-[13px] sm:text-[15px] md:text-[16px] xl:text-[18px] font-extrabold tracking-tight text-navy leading-tight">
              Government Polytechnic
            </span>
            <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5">
              <span className="font-brand text-[11px] min-[390px]:text-[12px] sm:text-[14px] md:text-[15px] xl:text-[16px] font-extrabold tracking-tight text-navy leading-tight">
                for Women, Srinagar
              </span>
              <span className="text-[8.5px] min-[390px]:text-[9.5px] sm:text-[10.5px] font-bold tracking-wider text-muted-foreground uppercase leading-none shrink-0">
                Since 1986
              </span>
            </div>
          </div>
        </Link>

        {/* Nav — right */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-2.5 xl:flex 2xl:gap-3.5"
          >
            <HeaderCtaPills {...(pills ? { pills } : {})} />
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
              className="z-[70] flex h-full w-[min(100%-1rem,22rem)] max-w-[22rem] flex-col justify-between overflow-hidden border-border bg-surface-white p-0 shadow-2xl"
            >
              {/* Drawer Top Branding Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3.5 pr-12">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CollegeLogo variant="header-compact" priority />
                  <div className="flex flex-col min-w-0">
                    <SheetTitle className="font-brand text-xs min-[380px]:text-sm font-extrabold tracking-tight text-navy leading-tight truncate">
                      GPW Srinagar
                    </SheetTitle>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      Govt. Polytechnic for Women
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable Navigation Body */}
              <div className="flex-1 overflow-y-auto">
                <HeaderCtaMobileGroups pills={pills} onNavigate={() => setOpen(false)} />
              </div>

              {/* Bottom Auth & Portal Actions */}
              <div className="shrink-0 border-t border-border bg-mist/50 p-3">
                <HeaderAuthButtons
                  variant="mobile"
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
