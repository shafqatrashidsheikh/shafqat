import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HOME_FAQS } from "@/lib/site-data";

type FaqItem = { q: string; a: string };

/** Homepage FAQ block — heading rail on the left, answers filling the page width. */
export function HomeFaqs({ items }: { items?: FaqItem[] }) {
  const list = items && items.length > 0 ? items : HOME_FAQS;
  return (
    <section aria-labelledby="home-faqs-heading" className="section-misty section-y !pt-0">
      <div className="container-page grid min-w-0 gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <div className="min-w-0 lg:sticky lg:top-28" data-motion-from="up">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
            FAQs
          </p>
          <h2
            id="home-faqs-heading"
            className="heading-section mt-3 font-display font-extrabold text-navy"
          >
            Frequently asked questions
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Common queries about eligibility, programme duration, syllabus and official notices.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <Link to="/admissions" className="link-cta group w-fit">
              Admission details
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link to="/contact" className="link-cta group w-fit">
              Ask the institute
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        <Accordion
          type="single"
          collapsible
          className="card-premium min-w-0 px-5 sm:px-6 lg:px-7"
          data-motion-from="up"
        >
          {list.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-border last:border-b-0">
              <AccordionTrigger className="gap-6 py-4 text-left font-display text-base font-bold text-navy hover:no-underline sm:py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground sm:pb-5 sm:text-[0.9375rem]">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
