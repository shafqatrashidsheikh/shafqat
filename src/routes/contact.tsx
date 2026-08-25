import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { PageHeader } from "@/components/site/PageHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { INSTITUTE } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
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
        crumb="Contact"
        title="Contact & Grievance"
        intro="Reach the institute office, departmental contacts, grievance redressal cell or website support."
      />
      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_360px]">
          <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-border bg-surface p-8 shadow-soft">
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
            <Button type="submit" className="mt-7 min-h-11 rounded-lg px-7">Submit enquiry</Button>
          </form>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-display text-sm font-bold tracking-wide text-navy uppercase">
                Institute office
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-brand" />{INSTITUTE.address}</li>
                <li className="flex gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-brand" />{INSTITUTE.phone}</li>
                <li className="flex gap-2.5"><Mail className="mt-0.5 size-4 shrink-0 text-brand" />{INSTITUTE.email}</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="font-display text-sm font-bold tracking-wide text-navy uppercase">
                Support cells
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                {["Grievance Redressal Cell", "Anti-Ragging Committee", "Internal Complaints Committee", "Women Safety & Support", "Website Support / IT Cell"].map((c) => (
                  <li key={c}>{c} — [ADD CONTACT]</li>
                ))}
              </ul>
            </div>
            <div className="grid h-56 place-items-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
              [ADD GOOGLE MAPS EMBED]
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
