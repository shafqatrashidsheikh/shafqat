import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HOME_FAQS } from "@/lib/site-data";

/** IITD-style homepage FAQ block */
export function HomeFaqs() {
  return (
    <section aria-label="Frequently asked questions" className="section-misty section-y !pt-0">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand uppercase">
            FAQs
          </p>
          <div className="mt-3 h-0.5 w-10 rounded-full bg-brand" />
          <h2 className="mt-3 font-display text-2xl font-extrabold text-navy sm:text-3xl">
            Frequently asked questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="card-premium mt-8 max-w-3xl px-5 sm:px-6">
          {HOME_FAQS.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-border">
              <AccordionTrigger className="py-4 text-left font-display font-bold text-navy hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
