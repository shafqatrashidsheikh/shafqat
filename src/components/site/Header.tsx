import { Link } from "@tanstack/react-router";
import { Menu, Search, ChevronDown, Accessibility } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NAV, UTILITY_LINKS, INSTITUTE } from "@/lib/site-data";
import { Logo } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-navy-deep text-on-dark md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <nav aria-label="Utility" className="flex items-center gap-5">
            {UTILITY_LINKS.map((l) => (
              <Link key={l.label} to={l.to} className="link-underline opacity-80 transition-opacity hover:opacity-100">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 opacity-80">
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

      <div className="surface-glass border-b border-border/70">
        <div className="container-page flex h-[70px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-extrabold text-navy sm:text-base">
                <span className="hidden sm:inline">Government Polytechnic for Women</span>
                <span className="sm:hidden">GPW Srinagar</span>
              </span>
              <span className="block text-[11px] font-medium tracking-[0.14em] text-teal uppercase">
                <span className="hidden sm:inline">Srinagar · Since {INSTITUTE.established}</span>
                <span className="sm:hidden">Since {INSTITUTE.established}</span>
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
            {NAV.map((item) => (
              <div key={item.label} className="group relative">
                <Link
                  to={item.to}
                  activeProps={{ className: "text-teal-deep" }}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-navy transition-colors hover:text-teal"
                >
                  {item.label}
                  {item.children && <ChevronDown className="size-3.5 opacity-60" />}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-0 top-full w-60 translate-y-1 rounded-xl border border-border bg-popover p-2 opacity-0 shadow-raised transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        to={c.to}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-teal-deep"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/admissions">Admissions 2026</Link>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu" className="min-h-11 min-w-11 xl:hidden">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto">
                <SheetTitle className="px-4 pt-4 font-display text-navy">Menu</SheetTitle>
                <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
                  {NAV.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-3 text-base font-medium text-navy transition-colors hover:bg-secondary"
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
                        className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground"
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
