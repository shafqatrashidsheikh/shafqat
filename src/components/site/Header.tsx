import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  HeaderCtaMobileGroups,
  HeaderCtaPills,
  HEADER_APPLY,
} from "@/components/site/HeaderCtaPills";
import { INSTITUTE } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { CollegeLogo } from "./CollegeLogo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-[60] w-full bg-background px-2 pt-1.5 sm:px-3 sm:pt-2">
      <div
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface-white px-3 shadow-soft transition-[min-height,box-shadow] duration-300 sm:gap-4 sm:px-4",
          scrolled ? "min-h-[80px] lg:min-h-[92px]" : "min-h-[88px] lg:min-h-[108px] xl:min-h-[112px]",
          scrolled && "shadow-raised",
        )}
      >
        <Link
            to="/"
            aria-label="Government Polytechnic for Women, Srinagar — Home"
            className="flex min-w-0 shrink-0 items-center gap-3 sm:gap-3.5 lg:gap-4"
          >
            <CollegeLogo variant={scrolled ? "header-compact" : "header"} priority />
            <span className="min-w-0 leading-tight">
              <span className="block font-display text-[13px] font-extrabold text-navy sm:text-sm lg:text-base xl:text-lg">
                {INSTITUTE.name}
              </span>
              <span className="mt-0.5 block text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase sm:text-[11px]">
                Since {INSTITUTE.established}
              </span>
            </span>
          </Link>

          <div className="hidden min-w-0 items-center lg:flex">
            <HeaderCtaPills />
            <Link to="/admissions" className={cn(HEADER_APPLY, "ml-6 xl:ml-7")}>
              Apply Now
            </Link>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Open menu"
                className="size-10 shrink-0 rounded-full border-border text-navy lg:hidden"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(88vw,20rem)] overflow-y-auto border-border bg-surface-white p-0"
            >
              <SheetTitle className="border-b border-border px-5 py-4 font-display text-base font-bold text-navy">
                Menu
              </SheetTitle>
              <HeaderCtaMobileGroups onNavigate={() => setOpen(false)} />
              <div className="border-t border-border p-4">
                <Link
                  to="/admissions"
                  onClick={() => setOpen(false)}
                  className={cn(HEADER_APPLY, "w-full")}
                >
                  Apply Now
                </Link>
              </div>
            </SheetContent>
          </Sheet>
      </div>
    </header>
  );
}
