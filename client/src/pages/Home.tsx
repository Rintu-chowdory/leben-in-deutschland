import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { CheckCircle2, BookOpen, DollarSign, FileText, GraduationCap, Heart, Home as HomeIcon, Landmark, MapPin, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const features = [
    {
      icon: Landmark,
      title: "Anmeldung",
      description: "Step-by-step guidance for German registration with office locator",
      gradient: "gradient-card-1",
    },
    {
      icon: DollarSign,
      title: "Bank Account",
      description: "Compare recommended banks with affiliate links and bonuses",
      gradient: "gradient-card-2",
    },
    {
      icon: Heart,
      title: "Health Insurance",
      description: "Compare GKV vs PKV options with provider recommendations",
      gradient: "gradient-card-3",
    },
    {
      icon: FileText,
      title: "Visa & Permits",
      description: "Comprehensive residence permit guidance and application steps",
      gradient: "gradient-card-4",
    },
    {
      icon: GraduationCap,
      title: "Integration Courses",
      description: "Find courses by city and type with direct BAMF links",
      gradient: "gradient-card-5",
    },
    {
      icon: BookOpen,
      title: "Tax ID Help",
      description: "Steueridentifikationsnummer walkthrough with checklist",
      gradient: "gradient-card-6",
    },
  ];

  const benefits = [
    "Trusted guidance from bureaucracy experts",
    "Step-by-step walkthroughs for every process",
    "Track your progress across all modules",
    "Save resources and personal notes",
    "Premium features for power users",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-sm">LiD</span>
            </div>
            <span className="font-bold text-lg gradient-text">Leben in Deutschland</span>
          </div>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white">
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => (window.location.href = getLoginUrl())}>
                  Sign In
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white" onClick={() => (window.location.href = getLoginUrl())}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animation: "blob 7s infinite 2s" }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animation: "blob 7s infinite 4s" }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Welcome to your German journey</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent">
              Navigate German Bureaucracy with Confidence
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your all-in-one platform for every essential step. From registration to tax ID, we guide you through every bureaucratic process with clarity and expertise.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {isAuthenticated ? (
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-lg px-8 text-white" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              ) : (
                <>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-lg px-8 text-white" onClick={() => (window.location.href = getLoginUrl())}>
                    Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-blue-300" onClick={() => (window.location.href = getLoginUrl())}>
                    Learn More
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Everything You Need</h2>
            <p className="text-xl text-gray-600">Comprehensive modules covering all aspects of settling in Germany</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className={`p-6 ${feature.gradient} hover-lift border-0 shadow-lg overflow-hidden relative group cursor-pointer transform transition-all duration-300`}
                  style={{ animation: `fade-in-up 0.6s ease-out ${idx * 0.1}s backwards` }}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <Icon className="w-12 h-12 mb-4 text-white drop-shadow-lg" />
                    <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-white/90 text-sm">{feature.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8">Why Choose Leben in Deutschland?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-4 fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <CheckCircle2 className="w-6 h-6 text-amber-300 flex-shrink-0 mt-1" />
                    <p className="text-white text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-orange-300 rounded-2xl transform rotate-6 opacity-20"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  {[
                    { num: "1", title: "Sign Up", desc: "Create your account in seconds", color: "from-blue-500 to-purple-500" },
                    { num: "2", title: "Explore Modules", desc: "Access all 6 comprehensive guides", color: "from-purple-500 to-pink-500" },
                    { num: "3", title: "Track Progress", desc: "Monitor your journey to integration", color: "from-amber-500 to-orange-500" },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all">
                      <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold">{step.num}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{step.title}</p>
                        <p className="text-sm text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you need premium features</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="p-8 border-2 border-gray-200 hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">€0<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                {["All core modules", "Progress tracking", "Save resources"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full border-2" onClick={() => window.location.href = getLoginUrl()}>
                Get Started
              </Button>
            </Card>

            <Card className="p-8 border-2 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-400 hover:shadow-xl transition-all transform hover:scale-105">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">Most Popular</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <p className="text-blue-600 font-semibold mb-6">Unlock all features</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">€9.99<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                {["Everything in Free", "Priority support", "Advanced analytics", "Exclusive resources"].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white" onClick={() => window.location.href = getLoginUrl()}>
                Upgrade Now
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Simplify Your German Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Join thousands of newcomers who are navigating German bureaucracy with confidence</p>
          <Button size="lg" className="bg-gradient-to-r from-amber-400 to-orange-500 hover:shadow-xl text-lg px-8 text-gray-900 font-bold" onClick={() => (window.location.href = getLoginUrl())}>
            Start Your Free Account Today <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {[
              { title: "Product", links: ["Features", "Pricing", "Dashboard"] },
              { title: "Resources", links: ["Blog", "Guides", "FAQ"] },
              { title: "Company", links: ["About", "Contact", "Careers"] },
              { title: "Legal", links: ["Privacy", "Terms", "Impressum"] },
            ].map((col, idx) => (
              <div key={idx}>
                <h3 className="font-bold text-white mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link, lidx) => (
                    <li key={lidx}><a href="#" className="hover:text-white transition">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2026 Leben in Deutschland. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
}
