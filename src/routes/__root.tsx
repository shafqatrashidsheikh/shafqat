import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { loadSiteChrome } from "@/lib/loaders/site-chrome";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { GPWAssistant } from "@/components/gpw-assistant/GPWAssistant";
import { SiteBackLink } from "@/components/site/SiteBackLink";
import { PagePreloader } from "@/components/site/PagePreloader";
import { BOOKS_ART_SRC, GRADUATION_ART_SRC, LOADER_LOGO_SRC } from "@/lib/loader-assets";
import { PageNavigation } from "@/components/site/PageNavigation";
import { InternalRouteMemory } from "@/components/site/ContextualBack";
import { LiveUpdatesTicker } from "@/components/site/LiveUpdatesTicker";
import { RouteTransition } from "@/components/site/RouteTransition";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { ConnectionErrorState } from "@/components/site/ConnectionErrorState";
import { NetworkConnectionGuard } from "@/components/site/NetworkConnectionGuard";
import { RoutePendingState } from "@/components/site/RoutePendingState";
import { isNetworkLikeError } from "@/lib/network-error";

function NotFoundComponent() {
  return (
    <div className="bg-background">
      <div className="container-page pt-8 sm:pt-10">
        <PageNavigation currentLabel="Page not found" />
      </div>
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-24">
        <div className="max-w-xl text-center">
          <svg
            viewBox="0 0 200 60"
            className="mx-auto h-16 w-56 text-brand"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M4 52 L52 14 L84 42 L116 10 L164 52" strokeLinejoin="round" />
            <path d="M0 56h200" />
          </svg>
          <p className="mt-6 font-display text-sm font-semibold tracking-[0.2em] text-brand uppercase">
            Error 404
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-navy sm:text-4xl">
            Looks like you&apos;ve taken a wrong turn.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Let&apos;s get you back to the Government Polytechnic for Women, Srinagar campus.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-deep"
            >
              Institute Home
            </Link>
            <Link
              to="/academics"
              className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-light-blue"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const networkLike = isNetworkLikeError(error);

  const retry = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      window.location.reload();
      return;
    }
    void router.invalidate().finally(() => {
      reset();
    });
  }, [reset, router]);

  useEffect(() => {
    if (!networkLike) return;
    const onOnline = () => {
      void router.invalidate().finally(() => reset());
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [networkLike, reset, router]);

  const detailMessage = error instanceof Error ? error.message : error != null ? String(error) : undefined;

  return (
    <div className="min-w-0 overflow-x-hidden bg-background">
      <ConnectionErrorState
        onRetry={retry}
        detail={import.meta.env.DEV ? detailMessage : undefined}
        {...(networkLike
          ? {}
          : {
              statusLabel: "GPW Srinagar",
              title: "This page isn’t available",
              body: "Something went wrong while opening this page.",
              tips: [
                "Reloading the page",
                "Checking your internet connection",
                "Coming back in a few moments",
              ],
              errorCode: "ERR_PAGE_LOAD",
            })}
      />
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => loadSiteChrome(),
  staleTime: 5 * 60_000,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Government Polytechnic for Women, Srinagar" },
      {
        name: "description",
        content:
          "Official website of Government Polytechnic for Women, Srinagar — diploma programs, admissions, departments, placements and campus life.",
      },
      { property: "og:site_name", content: "Government Polytechnic for Women, Srinagar" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,600;8..60,700;8..60,800&family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap",
      },
      { rel: "preload", href: LOADER_LOGO_SRC, as: "image" },
      { rel: "preload", href: BOOKS_ART_SRC, as: "image" },
      { rel: "preload", href: GRADUATION_ART_SRC, as: "image" },
      /* Browser-tab favicon — unique filenames for Chrome cache. TanStack Start head links. */
      {
        rel: "icon",
        href: "/gpw-icon-v20-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        rel: "icon",
        href: "/gpw-icon-v20-16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        rel: "icon",
        href: "/gpw-icon-v20-48.png",
        sizes: "48x48",
        type: "image/png",
      },
      { rel: "shortcut icon", href: "/gpw-icon-v20.ico" },
      { rel: "icon", href: "/gpw-icon-v20.ico", sizes: "any" },
      {
        rel: "apple-touch-icon",
        href: "/gpw-icon-v20-180.png",
        sizes: "180x180",
      },
      { rel: "manifest", href: "/site.webmanifest?v=20" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Government Polytechnic for Women, Srinagar",
          foundingDate: "1986",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Bemina",
            addressLocality: "Srinagar",
            addressRegion: "Jammu & Kashmir",
            postalCode: "190018",
            addressCountry: "IN",
          },
          telephone: "+91-194-2491176",
          email: "wpolysgr@yahoo.co.in",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* First-paint cover so refresh never shows page content before the loader CSS/JS. */}
        <style
          dangerouslySetInnerHTML={{
            __html:
            "html:has(.story-loader) .site-shell>:not(.story-loader){visibility:hidden!important;pointer-events:none!important}html:has(.story-loader),html:has(.story-loader) body{overflow:hidden!important;background:var(--background,#eaf0fa)}html,body{scrollbar-width:none!important;-ms-overflow-style:none!important}html::-webkit-scrollbar,body::-webkit-scrollbar,*::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}",
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const siteChrome = Route.useLoaderData();
  const isNavigating = useRouterState({
    select: (s) =>
      s.status === "pending" &&
      s.resolvedLocation != null &&
      s.location.href !== s.resolvedLocation.href,
  });
  const [showPending, setShowPending] = useState(false);

  useEffect(() => {
    if (!isNavigating) {
      setShowPending(false);
      return;
    }
    // Avoid spinner flash on instant navigations; still never keep the previous page mounted.
    const timer = window.setTimeout(() => setShowPending(true), 100);
    return () => window.clearTimeout(timer);
  }, [isNavigating]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="site-shell flex min-h-svh min-w-0 w-full max-w-full flex-1 flex-col overflow-x-clip">
        <PagePreloader />
        <InternalRouteMemory />
        <NetworkConnectionGuard />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Header institute={siteChrome.institute} headerNav={siteChrome.headerNav} />
        <LiveUpdatesTicker initial={siteChrome.liveNotices} />
        <main
          id="main"
          className="relative z-0 flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-x-clip bg-background"
        >
          {isNavigating ? (
            showPending ? (
              <RoutePendingState />
            ) : (
              <div
                className="min-h-[40vh] w-full flex-1 bg-background"
                aria-busy="true"
                aria-label="Loading page"
              />
            )
          ) : (
            <RouteTransition>
              {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
              <Outlet />
            </RouteTransition>
          )}
        </main>
        <ScrollReveal />
        <Footer institute={siteChrome.institute} navLinks={siteChrome.navLinks} />
        <SiteBackLink />
        <GPWAssistant />
      </div>
    </QueryClientProvider>
  );
}
