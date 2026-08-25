import { Link } from "@tanstack/react-router";
import { Menu, Search, ChevronDown, Accessibility } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NAV, UTILITY_LINKS, INSTITUTE } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { CollegeLogo } from "./CollegeLogo";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 overflow-x-clip">
      <div className="hidden border-b border-border bg-surface md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs text-muted-foreground">
          <nav aria-label="Utility" className="flex items-center gap-5">
            {UTILITY_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="link-underline transition-colors hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <span className="hidden lg:inline">English · हिन्दी · اردو</span>
            <span className="inline-flex items-center gap-1.5">
              <Accessibility className="size-3.5" /> Accessibility
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Search className="size-3.5" /> Ctrl + K
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-b border-border bg-surface transition-all duration-300",
          scrolled && "shadow-header",
        )}
      >
        <div
          className={cn(
            "container-page flex items-center justify-between gap-2 transition-[min-height] duration-300 sm:gap-3",
            scrolled
              ? "min-h-[60px] sm:min-h-[64px] md:min-h-[68px] lg:min-h-[80px]"
              : "min-h-[68px] sm:min-h-[72px] md:min-h-[80px] lg:min-h-[92px]",
          )}
        >
          <Link
            to="/"
            aria-label="Government Polytechnic for Women, Srinagar — Home"
            className="flex min-w-0 flex-1 items-center gap-2.5 pr-2 sm:max-w-[min(100%,42rem)] sm:gap-3 sm:pr-3 xl:flex-none"
          >
            <CollegeLogo variant={scrolled ? "header-compact" : "header"} priority />
            <span className="min-w-0 leading-tight">
              <span className="block font-display text-[13px] font-extrabold text-navy sm:text-[15px] md:text-base">
                <span className="hidden lg:inline">Government Polytechnic for Women, Srinagar</span>
                <span className="lg:hidden">Government Polytechnic for Women</span>
              </span>
              <span className="block text-[10px] font-medium tracking-[0.12em] text-muted-foreground uppercase sm:text-[11px]">
                <span className="hidden md:inline lg:hidden">Srinagar · Since {INSTITUTE.established}</span>
                <span className="hidden lg:inline">Since {INSTITUTE.established}</span>
                <span className="md:hidden">Srinagar</span>
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
            {NAV.map((item) => (
              <div key={item.label} className="group relative">
                <Link
                  to={item.to}
                  activeProps={{
                    className:
                      "text-brand after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-brand",
                  }}
                  className="relative flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-navy transition-colors hover:text-brand"
                >
                  {item.label}
                  {item.children && <ChevronDown className="size-3.5 opacity-60" />}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-0 top-full w-60 translate-y-1 rounded-xl border border-border bg-surface p-2 opacity-0 shadow-raised transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        to={c.to}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-light-blue hover:text-brand"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Button asChild size="sm" className="hidden rounded-lg sm:inline-flex">
              <Link to="/admissions">Admissions 2026</Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open menu"
                  className="min-h-11 min-w-11 rounded-lg border-border xl:hidden"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto border-border bg-surface">
                <SheetTitle className="px-4 pt-4 font-display text-navy">Menu</SheetTitle>
                <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
                  {NAV.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-3 text-base font-medium text-navy transition-colors hover:bg-light-blue hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
                    {UTILITY_LINKS.map((l) => (
                      <Link
                        key={l.label}
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className="rounded-lg bg-light-blue px-3 py-2 text-sm text-navy"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
