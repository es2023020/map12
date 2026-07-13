import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { Mail, MessageSquare, Phone, Clock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact PropTrack — Get in Touch" },
      { name: "description", content: "Reach out to PropTrack for sales inquiries, broker support, developer partnerships, or agency pricing." },
    ],
  }),
  component: ContactPage,
});

const contactMethods = [
  {
    icon: MessageSquare,
    title: "WhatsApp Support",
    desc: "Chat directly with our team for fast answers.",
    action: "Open WhatsApp",
    href: "https://wa.me/2201029324783",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Mail,
    title: "Email Us",
    desc: "We respond to all inquiries within 24 hours.",
    action: "support@proptrack.eg",
    href: "mailto:support@proptrack.eg",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Phone,
    title: "Call Sales",
    desc: "Speak to our enterprise sales team directly.",
    action: "Call Advisor",
    href: "tel:201029324783",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Clock,
    title: "Support Hours",
    desc: "Saturday – Thursday, 9 AM – 8 PM (Cairo time)",
    action: null,
    href: null,
    color: "text-muted-foreground",
    bg: "bg-secondary",
  },
];

const subjects = [
  "General inquiry",
  "Broker plan upgrade",
  "Agency / team pricing",
  "Developer partnership",
  "Technical support",
  "Data correction request",
  "Other",
];

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: subjects[0], message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Shell>
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-accent/80 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-8">
          <h1 className="font-display text-5xl font-bold tracking-tight">Get in touch</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl mx-auto">
            Whether you're a broker, agency manager, or property developer — we're here to help.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">

          {/* Contact Methods */}
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-bold text-primary">Contact options</h2>
            {contactMethods.map((m) => (
              <div key={m.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${m.bg}`}>
                  <m.icon className={`h-5 w-5 ${m.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{m.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{m.desc}</p>
                  {m.href && m.action && (
                    <a href={m.href} target="_blank" rel="noopener noreferrer" className={`mt-1 text-sm font-semibold ${m.color} hover:underline`}>
                      {m.action}
                    </a>
                  )}
                  {!m.href && m.action && (
                    <p className="mt-1 text-sm font-medium text-foreground/70">{m.action}</p>
                  )}
                </div>
              </div>
            ))}

            {/* ADIB Bank Note */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-5">
              <h3 className="font-semibold text-primary text-sm mb-2">💳 Subscription Payments</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All PropTrack subscriptions are paid via <strong className="text-primary">ADIB bank transfer</strong>. After registering and selecting your plan, you'll receive full payment instructions in your dashboard's Billing section.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-10">
                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                <h3 className="font-display font-bold text-primary text-xl">Message sent!</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  We'll get back to you within 24 hours. For urgent matters, reach us on WhatsApp.
                </p>
                <Button variant="outline" className="rounded-full mt-2" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: subjects[0], message: "" }); }}>
                  Send another message
                </Button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-xl font-bold text-primary mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                      <Input
                        placeholder="Ahmed Hassan"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="mt-1.5 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                      <Input
                        type="email"
                        placeholder="ahmed@agency.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="mt-1.5 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Phone / WhatsApp</label>
                    <Input
                      placeholder="+20 1XX XXX XXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-1.5 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-border bg-transparent px-3 py-2 text-sm text-primary focus:border-accent focus:outline-none"
                    >
                      {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                    <textarea
                      placeholder="Tell us how we can help you..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={5}
                      className="mt-1.5 w-full rounded-xl border border-border bg-transparent px-3 py-2.5 text-sm text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none resize-none"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-xl font-semibold">
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
