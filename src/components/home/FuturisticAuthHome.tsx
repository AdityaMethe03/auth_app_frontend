import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, Lock, Sparkles, Building2, KeyRound, UsersRound } from "lucide-react";
import { Link } from "react-router";

export default function FuturisticAuthHome() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-28 px-6 text-center flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Authentication for every tenant.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground"
        >
          Manage sign-in, organization-specific users, roles, and permissions from one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 flex gap-4"
        >
          <Button asChild size="lg" className="rounded-2xl text-lg px-6">
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button asChild
            size="lg"
            variant="outline"
            className="rounded-2xl text-lg px-6 border-border"
          >
            <Link to="/about">Learn More</Link>
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Authentication and access management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-fr gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Tenant-based accounts",
              desc: "Keep each organization’s users and roles within its own tenant space.",
              icon: <Building2 className="w-10 h-10" />,
            },
            {
              title: "Sign-in options",
              desc: "Support email and password authentication, with configured Google and GitHub sign-in.",
              icon: <Lock className="w-10 h-10" />,
            },
            {
              title: "Role-based permissions",
              desc: "Organize access into roles and manage the actions available to each role.",
              icon: <KeyRound className="w-10 h-10" />,
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/70 backdrop-blur-xl border-border rounded-2xl shadow-lg">
                <CardContent className="flex h-full flex-col justify-center p-8 text-center">
                  <div className="flex justify-center mb-6 text-primary">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-6 text-center bg-card/50 backdrop-blur-lg border-t border-border">
        <h2 className="text-4xl font-bold">A clear place to manage identity</h2>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground text-lg">
          Sign in with your tenant code to access your workspace, or create an
          account if registration is enabled.
        </p>

        <Button asChild size="lg" className="mt-8 px-8 text-lg rounded-2xl">
          <Link to="/signup">Create Account</Link>
        </Button>
      </section>

      {/* Extra Section — Why Choose Us */}
      <section className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Built for practical administration
        </h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-muted-foreground">
          <div>
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" /> Tenant separation
            </h3>
            <p>
              Tenant codes direct users to their organization’s account space,
              keeping user and role management scoped to that tenant.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <UsersRound className="w-6 h-6 text-primary" /> User administration
            </h3>
            <p>
              Authorized administrators can create accounts and manage profile,
              status, and assigned roles.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" /> API documentation
            </h3>
            <p>
              Explore the available authentication and administration endpoints
              through the backend’s OpenAPI documentation.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" /> Role-based access
            </h3>
            <p>
              Assign permissions through roles to control access to supported
              user, role, and tenant features.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} Auth App. All rights reserved.
      </footer>
    </div>
  );
}
