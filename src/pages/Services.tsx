
import {
  ArrowRight,
  Building2,
  KeyRound,
  LockKeyhole,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: LockKeyhole,
    number: "01",
    title: "Authentication",
    description:
      "Provide account sign-in with email and password, plus configured Google and GitHub sign-in options.",
  },
  {
    icon: Building2,
    number: "02",
    title: "Tenant management",
    description:
      "Keep each organization’s users and roles in its own tenant space, with platform-level tenant administration.",
  },
  {
    icon: KeyRound,
    number: "03",
    title: "Role-based permissions",
    description:
      "Create and manage roles with permissions that control access to supported user, role, and tenant features.",
  },
  {
    icon: UsersRound,
    number: "04",
    title: "User administration",
    description:
      "Give authorized administrators a place to manage user profiles, account status, and assigned roles.",
  },
];

function Services() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-background px-4 py-14 text-foreground sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Services
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            The common identity tools your app can build on.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Auth App brings account access and administration into a shared
            foundation. Use the capabilities you need and adapt the rest for
            your product.
          </p>
        </header>

        <section className="mt-12 grid gap-4 sm:grid-cols-2" aria-label="Available services">
          {services.map(({ icon: Icon, number, title, description }) => (
            <Card key={number} className="rounded-2xl bg-card/70 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="flex gap-5 p-6 sm:p-7">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold tracking-widest text-muted-foreground">{number}</p>
                  <h2 className="mt-1 text-xl font-semibold">{title}</h2>
                  <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border bg-muted/40 p-6 text-center sm:flex-row sm:text-left sm:p-8">
          <div>
            <h2 className="text-xl font-semibold">Ready to access your workspace?</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in with your tenant code, or create an account if registration is enabled.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">
                Create account <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Services;
