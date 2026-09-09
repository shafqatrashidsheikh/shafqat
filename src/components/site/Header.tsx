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
          "flex w-full min-w-0 items-center gap-3 rounded-2xl border border-border bg-surface-white px-3 shadow-soft transition-[box-shadow,padding] duration-300 sm:gap-4 sm:px-4 lg:gap-5 lg:px-5 xl:px-6",
          "py-2.5 sm:py-3 xl:py-3.5",
          scrolled && "shadow-raised",
        )}
      >
        {/* Brand — logo + name kept as one tight group */}
        <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3 lg:gap-3.5">
          <Link
            to="/"
            aria-label="Government Polytechnic for Women, Srinagar — Home"
            className="shrink-0"
          >
            <CollegeLogo variant={scrolled ? "header-compact" : "header"} priority />
          </Link>
          <Link to="/" className="min-w-0">
            <span className="font-brand block min-w-0 whitespace-normal text-[clamp(0.9375rem,0.4vw+0.75rem,1.25rem)] font-extrabold leading-snug text-navy lg:whitespace-nowrap xl:text-[1.2rem] 2xl:text-[1.3rem]">
              {institute.name}
            </span>
          </Link>
        </div>

        {/* Nav — sits cleanly on the right with even control spacing */}
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
