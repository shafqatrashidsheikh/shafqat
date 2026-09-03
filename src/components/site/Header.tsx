import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
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

export function Header({ institute = INSTITUTE, headerNav }: HeaderProps) {
  const pills = headerNav ?? undefined;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-[60] w-full min-w-0 bg-background px-3 pt-2.5 sm:px-4 sm:pt-3 lg:px-5">
      <div
        className={cn(
          "grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3.5 rounded-2xl border border-border bg-surface-white px-3 shadow-soft transition-[box-shadow,padding] duration-300 sm:gap-x-4 sm:px-4 lg:px-5 xl:gap-x-5 xl:px-6 2xl:gap-x-6 2xl:px-7",
          "py-2.5 sm:py-3 xl:py-3.5",
          scrolled && "shadow-raised",
        )}
      >
        {/* Column 1 — logo */}
        <Link
          to="/"
          aria-label="Government Polytechnic for Women, Srinagar — Home"
          className="col-start-1 shrink-0 self-center"
        >
          <CollegeLogo variant={scrolled ? "header-compact" : "header"} priority />
        </Link>

        {/* Column 2 — college name (flexible, never overlaps nav) */}
        <Link
          to="/"
          className="col-start-2 min-w-0 self-center px-1 sm:px-0"
        >
          <span className="block min-w-0 leading-tight">
            <span className="block whitespace-normal font-display text-[clamp(0.875rem,0.34vw+0.72rem,1.25rem)] font-bold leading-snug text-navy xl:whitespace-nowrap xl:text-[1.125rem] 2xl:text-[1.3125rem]">
              {institute.name}
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase xl:text-xs">
              Since {institute.established}
            </span>
          </span>
        </Link>

        {/* Column 3 — navigation or mobile menu */}
        <div className="col-start-3 flex shrink-0 items-center justify-end self-center pl-1 xl:pl-3 2xl:pl-4">
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-2 xl:flex 2xl:gap-2.5"
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
