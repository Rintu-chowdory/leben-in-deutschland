import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  BookOpen, DollarSign, FileText, GraduationCap, Heart, Landmark,
  ArrowRight, Sparkles, GraduationCap as QuizIcon, Calculator, CheckCircle2,
} from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const features = [
    { icon: Landmark, title: "Anmeldung", description: "Wohnung anmelden – Schritt-für-Schritt-Anleitung mit Behördenfinder", path: "/module/anmeldung" },
    { icon: DollarSign, title: "Bankkonto", description: "Kontoeröffnung in Deutschland: Anbieter-Vergleich & Bonus-Angebote", path: "/module/bank" },
    { icon: Heart, title: "Krankenversicherung", description: "GKV oder PKV? Klärung des deutschen Gesundheitssystems", path: "/module/health" },
    { icon: FileText, title: "Visum & Aufenthalt", description: "Aufenthaltstitel, Verlängerungen und Arbeitsgenehmigungen", path: "/module/visa" },
    { icon: GraduationCap, title: "Integrationskurse", description: "Sprach- und Orientierungskurse in deiner Nähe finden", path: "/module/integration" },
    { icon: BookOpen, title: "Steuer-ID", description: "Steuerliche Identifikationsnummer beantragen – mit Checkliste", path: "/module/tax" },
  ];

  const tools = [
    { icon: QuizIcon, title: "Einbürgerungstest-Trainer", description: "30 Prüfungsfragen mit Erklärungen – übe für „Leben in Deutschland“", path: "/werkzeuge/einbuergerungstest" },
    { icon: Calculator, title: "Fristen-Rechner", description: "Anmelde-, Ummelde- und Antragsfristen automatisch berechnen", path: "/werkzeuge/fristenrechner" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50 border-b border-blue-100 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LiD</span>
            </div>
            <span className="font-bold text-lg gradient-text">Leben in Deutschland</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white" onClick={() => navigate("/dashboard")}>
              {isAuthenticated ? `Hallo, ${user?.name?.split(' ')[0] ?? ''}` : 'Kostenlos starten'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animation: "blob 7s infinite 2s" }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{ animation: "blob 7s infinite 4s" }}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Dein Wegweiser durch den deutschen Behördendschungel</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Ankommen in Deutschland –<br />
              <span className="gradient-text">ohne Behörden-Chaos</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Von der Anmeldung über das Bankkonto bis zur Steuer-ID: Schritt-für-Schritt-Anleitungen,
              interaktive Checklisten und praktische Werkzeuge – alles auf Deutsch, alles kostenlos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl text-white text-base px-8" onClick={() => navigate("/dashboard")}>
                Jetzt starten <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8" onClick={() => navigate("/werkzeuge/einbuergerungstest")}>
                Einbürgerungstest üben
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Module */}
      <section className="py-20 px-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Deine Module</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Sechs Themenbereiche, die beim Leben in Deutschland wirklich zählen – mit Fortschritt, den du im Blick behältst.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card
                  key={f.title}
                  className="p-6 cursor-pointer hover:shadow-xl hover:border-primary/40 transition-all group"
                  onClick={() => navigate(f.path)}
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Werkzeuge */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Werkzeuge & Trainer</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Praktische Helfer, die direkt im Browser laufen – ohne Anmeldung, ohne Wartezeit.
            </p>
          </div>
          <div className="grid gap-6 max-w-3xl mx-auto md:grid-cols-2">
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <Card
                  key={t.title}
                  className="p-8 cursor-pointer hover:shadow-xl hover:border-primary/40 transition-all group relative overflow-hidden"
                  onClick={() => navigate(t.path)}
                >
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                  <div className="flex items-center gap-4 relative">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{t.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Warum Leben in Deutschland?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto text-left">
            {[
              'Alles auf Deutsch – klar & verständlich erklärt',
              'Interaktive Checklisten mit Fortschrittsspeicherung',
              'Werkzeuge wie Fristen-Rechner & Test-Trainer',
              'Komplett kostenlos nutzbar – ohne Konto',
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-white/90">{b}</span>
              </div>
            ))}
          </div>
          <Button size="lg" variant="secondary" className="mt-12 text-base px-8 bg-white text-blue-700 hover:bg-white/90" onClick={() => navigate("/dashboard")}>
            Los geht's <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">Leben in Deutschland</p>
          <p>
            Ein unabhängiger Wegweiser für Neuzugezogene. Keine Rechtsberatung – verbindliche Auskünfte gibt die jeweilige Behörde.
          </p>
        </div>
      </footer>
    </div>
  );
}
