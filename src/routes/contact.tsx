import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AmpersandText, NaturalWrap } from "@/components/site/AmpersandText";
import { PageHeader } from "@/components/site/PageHeader";
import { LocationMap } from "@/components/site/LocationMap";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { fetchInstituteSettings } from "@/server/cda/site-extended";

export const Route = createFileRoute("/contact")({
  loader: () => fetchInstituteSettings(),
  head: () => ({
    meta: [
      { title: "Contact & Grievance — GPW Srinagar" },
      {
        name: "description",
        content:
          "Contact Government Polytechnic for Women, Srinagar — address, phone, email, departmental offices, grievance redressal and enquiry form.",
      },
      { property: "og:title", content: "Contact — GPW Srinagar" },
      { property: "og:description", content: "Address, offices, grievance redressal and enquiries." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  subject: z.string().trim().min(1, "Please enter a subject").max(150),
  message: z.string().trim().min(1, "Please enter your message").max(1000),
});

function Contact() {
  const institute = Route.useLoaderData();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    e.currentTarget.reset();
    toast.success("Enquiry submitted", {
      description: "The institute office will respond to your message.",
    });
  }

  return (
    <>
      <Toaster />
      <PageHeader
        compact
        crumb="Contact"
        title={<AmpersandText>Contact & Grievance</AmpersandText>}
        titleClassName="max-w-none"
        introClassName="mt-3 w-full min-w-0 max-w-none text-base leading-relaxed text-muted-foreground md:mt-3.5"
        intro={
          <NaturalWrap
            phrases={[
              "Institute office address, phone and email,",
              "with enquiry form and grievance redressal.",
            ]}
          />
        }
      />
      <section className="section-y !pt-2 md:!pt-2.5 lg:!pt-3">
        <div className="container-page grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_min(360px,34%)] lg:gap-12">
          <form onSubmit={onSubmit} noValidate className="min-w-0 h-fit rounded-3xl border border-border bg-surface p-5 shadow-soft sm:p-8">
            <h2 className="font-display text-xl font-extrabold text-navy">Enquiry form</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Full name" error={errors["name"] ?? ""} />
              <Field id="email" label="Email address" type="email" error={errors["email"] ?? ""} />
              <div className="sm:col-span-2">
                <Field id="subject" label="Subject" error={errors["subject"] ?? ""} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message" className="text-sm font-medium text-navy">Message</Label>
                <Textarea id="message" name="message" rows={5} className="mt-2" maxLength={1000} />
                {errors["message"] && <p className="mt-1.5 text-xs text-destructive">{errors["message"]}</p>}
              </div>
            </div>
            <Button type="submit" className="mt-7 min-h-11 w-full rounded-lg px-7 sm:w-auto">Submit enquiry</Button>
          </form>

          <aside className="min-w-0 space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="font-display text-sm font-bold tracking-wide text-navy uppercase">
                Institute office
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex min-w-0 gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  <span className="min-w-0 break-words">{institute.address}</span>
                </li>
                <li className="flex min-w-0 gap-2.5">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  <a href="tel:+911942491176" className="link-underline min-w-0 break-words hover:text-navy">
                    {institute.phone}
                  </a>
                </li>
                <li className="flex min-w-0 gap-2.5">
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                  <a href={`mailto:${institute.email}`} className="link-underline min-w-0 break-words hover:text-navy">
                    {institute.email}
                  </a>
                </li>
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Office hours and departmental extensions are published through official notices when updated.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <h2 className="font-display text-sm font-bold tracking-wide text-navy uppercase">Location</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Bemina, near State Board of School Education, Srinagar — PIN 190018
              </p>
              <LocationMap className="mt-4" size="contact" />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function Field({ id, label, type = "text", error }: { id: string; label: string; type?: string; error?: string }) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium text-navy">{label}</Label>
      <Input id={id} name={id} type={type} className="mt-2 h-11" maxLength={255} />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
