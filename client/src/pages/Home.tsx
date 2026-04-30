import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { CheckCircle2, BookOpen, DollarSign, FileText, GraduationCap, Heart, Home as HomeIcon, Landmark, MapPin } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const features = [
    {
      icon: Landmark,
      title: "Anmeldung Assistance",
      description: "Step-by-step guidance for German registration with office locator and required documents checklist.",
    },
    {
      icon: DollarSign,
      title: "Bank Account Setup",
      description: "Compare recommended banks with affiliate links and account opening bonuses for newcomers.",
    },
    {
      icon: Heart,
      title: "Health Insurance",
      description: "Compare public (GKV) and private (PKV) insurance options with provider recommendations.",
    },
    {
      icon: FileText,
      title: "Visa & Permits",
      description: "Comprehensive guidance on residence permits with step-by-step application instructions.",
    },
    {
      icon: GraduationCap,
      title: "Integration Courses",
      description: "Find integration courses by city and type with direct links to BAMF resources.",
    },
    {
      icon: BookOpen,
      title: "Tax ID Help",
      description: "Complete walkthrough for Steueridentifikationsnummer application with downloadable checklist.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <HomeIcon className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Leben in Deutschland</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">{user?.name || user?.email}</span>
                <Button onClick={() => navigate("/dashboard")} variant="default">
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => window.location.href = getLoginUrl()}>
                  Login
                </Button>
                <Button variant="default" onClick={() => window.location.href = getLoginUrl()}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Navigate German Bureaucracy with Confidence
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Your all-in-one platform for every essential step. From registration to tax ID, we guide you through every bureaucratic process with clarity and expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button size="lg" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
                    Get Started Free
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => window.location.href = getLoginUrl()}>
                    Learn More
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 md:py-32 bg-card/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive modules covering all aspects of settling in Germany
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose Leben in Deutschland?
              </h2>
              <ul className="space-y-4">
                {[
                  "Trusted guidance from German bureaucracy experts",
                  "Step-by-step walkthroughs for every process",
                  "Track your progress across all modules",
                  "Save resources and personal notes",
                  "Premium features for power users",
                  "Affiliate partnerships with recommended providers",
                ].map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 min-h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Your journey to successful integration starts here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 md:py-32 bg-card/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade when you need premium features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
              <p className="text-muted-foreground mb-6">Perfect for getting started</p>
              <div className="text-3xl font-bold text-foreground mb-6">€0<span className="text-lg text-muted-foreground">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-foreground">All core modules</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Progress tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Save resources</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = getLoginUrl()}>
                Get Started
              </Button>
            </Card>

            <Card className="p-8 border-primary border-2">
              <h3 className="text-2xl font-bold text-foreground mb-2">Premium</h3>
              <p className="text-primary font-semibold mb-6">Most popular</p>
              <div className="text-3xl font-bold text-foreground mb-6">€9.99<span className="text-lg text-muted-foreground">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Everything in Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Advanced analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Exclusive resources</span>
                </li>
              </ul>
              <Button className="w-full" onClick={() => window.location.href = getLoginUrl()}>
                Upgrade Now
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Simplify Your German Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of newcomers who are navigating German bureaucracy with confidence
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => window.location.href = getLoginUrl()}
          >
            Start Your Free Account Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Guides</a></li>
                <li><a href="#" className="hover:text-foreground transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Impressum</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Leben in Deutschland. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
