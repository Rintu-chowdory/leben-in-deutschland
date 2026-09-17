import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import {
  BookOpen, DollarSign, FileText, GraduationCap, Heart, Landmark,
  Calculator, GraduationCap as QuizIcon, TrendingUp, Trophy, Clock, LogOut,
} from "lucide-react";
import { getQuizStat, moduleCompletion, overallCompletion } from "@/lib/progress";

const modules = [
  { id: 'anmeldung', name: 'Anmeldung', icon: Landmark, description: 'Wohnung anmelden – Schritt für Schritt', total: 5, path: '/module/anmeldung' },
  { id: 'bank', name: 'Bankkonto', icon: DollarSign, description: 'Kontoeröffnung & Bankvergleich', total: 5, path: '/module/bank' },
  { id: 'health', name: 'Krankenversicherung', icon: Heart, description: 'GKV vs. PKV im Vergleich', total: 4, path: '/module/health' },
  { id: 'visa', name: 'Visum & Aufenthalt', icon: FileText, description: 'Aufenthaltstitel & Verlängerung', total: 5, path: '/module/visa' },
  { id: 'integration', name: 'Integrationskurse', icon: GraduationCap, description: 'Kurse finden & anmelden', total: 4, path: '/module/integration' },
  { id: 'tax', name: 'Steuer-ID', icon: BookOpen, description: 'Steuerliche Identifikationsnummer', total: 5, path: '/module/tax' },
];

const tools = [
  {
    name: 'Einbürgerungstest-Trainer',
    icon: QuizIcon,
    description: '30 offizielle Prüfungsfragen – übe für „Leben in Deutschland“',
    path: '/werkzeuge/einbuergerungstest',
  },
  {
    name: 'Fristen-Rechner',
    icon: Calculator,
    description: 'Wichtige Fristen nach Umzug, Geburt & Co. im Blick behalten',
    path: '/werkzeuge/fristenrechner',
  },
];

function ProgressRing({ pct }: { pct: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
      <circle cx="70" cy="70" r={r} fill="none" strokeWidth="10" className="stroke-muted" />
      <circle
        cx="70" cy="70" r={r} fill="none" strokeWidth="10" strokeLinecap="round"
        stroke="url(#ringGrad)"
        strokeDasharray={c}
        strokeDashoffset={c - (c * pct) / 100}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    window.addEventListener('lid-progress-changed', onChange);
    return () => window.removeEventListener('lid-progress-changed', onChange);
  }, []);

  const { data: subscription } = trpc.subscription.getOrCreate.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const totals = Object.fromEntries(modules.map((m) => [m.id, m.total]));
  const total = overallCompletion(totals);
  const quiz = getQuizStat();
  void tick; // Neu-Render bei Fortschrittsänderung

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Kopf */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Willkommen zurück{user?.name ? `, ${user.name}` : ''} 👋
            </h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && subscription && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                {subscription.tier === 'premium' ? '✨ Premium' : 'Kostenlos'}
              </span>
            )}
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1" /> Abmelden
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground">Gast-Modus · Fortschritt wird lokal gespeichert</span>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Übersicht */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <ProgressRing pct={total} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">{total}%</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">Gesamtfortschritt</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                über alle 6 Module deines Ankommens in Deutschland
              </p>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-foreground">Einbürgerungstest</h3>
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {quiz.bestScore}<span className="text-base text-muted-foreground">%</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {quiz.attempts > 0
                  ? `${quiz.attempts} Versuche · letztes Ergebnis: ${quiz.lastScore}%`
                  : 'Noch nicht gespielt – jetzt üben!'}
              </p>
              <Button size="sm" className="mt-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => navigate('/werkzeuge/einbuergerungstest')}>
                Quiz starten
              </Button>
            </div>
          </Card>

          <Card className="p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-foreground">Fristen im Blick</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Anmeldung nach Umzug? Ummeldung des Autos? Behalte wichtige Fristen im Blick – der Rechner rechnet sie dir aus.
            </p>
            <Button size="sm" variant="outline" className="mt-3 w-fit" onClick={() => navigate('/werkzeuge/fristenrechner')}>
              Fristen berechnen
            </Button>
          </Card>
        </div>

        {/* Module */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Meine Module</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => {
              const pct = moduleCompletion(m.id, m.total);
              const Icon = m.icon;
              return (
                <Card
                  key={m.id}
                  className="p-5 cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all group"
                  onClick={() => navigate(m.path)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-primary">{pct}%</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{m.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{m.description}</p>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Werkzeuge */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Werkzeuge & Trainer</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tools.map((t) => {
              const Icon = t.icon;
              return (
                <Card
                  key={t.path}
                  className="p-6 cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all group relative overflow-hidden"
                  onClick={() => navigate(t.path)}
                >
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                  <div className="flex items-center gap-4 relative">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{t.name}</h3>
                      <p className="text-sm text-muted-foreground">{t.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
