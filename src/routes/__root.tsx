import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { loadSiteChrome } from "@/lib/loaders/site-chrome";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { GPWAssistant } from "@/components/gpw-assistant/GPWAssistant";
import { PagePreloader } from "@/components/site/PagePreloader";
import { BOOKS_ART_SRC, GRADUATION_ART_SRC, LOADER_LOGO_SRC } from "@/lib/loader-assets";
import { ContextualBack, InternalRouteMemory } from "@/components/site/ContextualBack";
import { RouteTransition } from "@/components/site/RouteTransition";
import { ScrollReveal } from "@/components/site/ScrollReveal";

function NotFoundComponent() {
  return (
    <div className="bg-background">
      <div className="container-page pt-8 sm:pt-10">
        <ContextualBack />
      </div>
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-24">
        <div className="max-w-xl text-center">
        <svg viewBox="0 0 200 60" className="mx-auto h-16 w-56 text-brand" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 52 L52 14 L84 42 L116 10 L164 52" strokeLinejoin="round" />
          <path d="M0 56h200" />
        </svg>
        <p className="mt-6 font-display text-sm font-semibold tracking-[0.2em] text-brand uppercase">Error 404</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-navy sm:text-4xl">
          Looks like you've taken a wrong turn.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Let's get you back to the Government Polytechnic for Women, Srinagar campus.
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


function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="bg-background">
      <div className="container-page pt-8 sm:pt-10">
        <ContextualBack />
      </div>
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            This page didn't load
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong on our end. You can try refreshing or head back home.
          </p>
          {import.meta.env.DEV && (
            <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-left font-mono text-xs text-destructive break-words">
              {error.message}
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Institute Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => loadSiteChrome(),
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
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap",
      },
      { rel: "preload", href: "/gpw-srinagar-logo.jpg", as: "image" },
      { rel: "preload", href: LOADER_LOGO_SRC, as: "image" },
      { rel: "preload", href: BOOKS_ART_SRC, as: "image" },
      { rel: "preload", href: GRADUATION_ART_SRC, as: "image" },
      { rel: "icon", href: "/favicon.ico?v=2", sizes: "any" },
      {
        rel: "icon",
        href: "/favicon-32x32.png?v=2",
        sizes: "32x32",
        type: "image/png",
      },
      {
        rel: "icon",
        href: "/favicon-16x16.png?v=2",
        sizes: "16x16",
        type: "image/png",
      },
      {
        rel: "icon",
        href: "/favicon-48x48.png?v=2",
        sizes: "48x48",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png?v=2",
        sizes: "180x180",
      },
      { rel: "manifest", href: "/site.webmanifest?v=2" },
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

  return (
    <QueryClientProvider client={queryClient}>
      <PagePreloader />
      <InternalRouteMemory />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header institute={siteChrome.institute} headerNav={siteChrome.headerNav} />
      <main id="main" className="relative z-0 min-w-0 overflow-x-clip bg-background">
        <RouteTransition>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </RouteTransition>
      </main>
      <ScrollReveal />
      <Footer institute={siteChrome.institute} navLinks={siteChrome.navLinks} />
      <GPWAssistant />
    </QueryClientProvider>
  );
}
