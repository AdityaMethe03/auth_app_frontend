
import { ArrowRight, Building2, KeyRound, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const principles = [
  {
    icon: Building2,
    title: "Organized by tenant",
    description:
      "Each organization has its own space for its users and roles, with a platform-level scope for tenant administration.",
  },
  {
    icon: KeyRound,
    title: "Roles with clear permissions",
    description:
      "Roles group permissions so administrators can manage what people can do in their organization.",
  },
  {
    icon: ShieldCheck,
    title: "A focused identity layer",
    description:
      "The application brings sign-in and account administration together, so product teams can build their own workflows on top.",
  },
];

function About() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-background px-4 py-14 text-foreground sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            About Auth App
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Identity and access, organized around your people.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Auth App is a foundation for applications that need user accounts,
            organization-specific access, and role-based administration. It
            keeps those common identity tasks in one place while each product
            remains free to define its own features and user experience.
          </p>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="Platform principles">
          {principles.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="h-full rounded-2xl bg-card/70 shadow-sm">
              <CardContent className="p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-lg font-semibold">{title}</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-12 flex flex-col justify-between gap-5 rounded-2xl border bg-muted/40 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-xl font-semibold">Designed to be adapted</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Use the shared account and access foundation, then shape the
              application around your project’s needs.
            </p>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/services">
              Explore services <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </main>
  );
}

export default About;
