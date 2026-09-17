import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ClipboardList, Lightbulb } from "lucide-react";
import { getChecked, setChecked } from "@/lib/progress";

export interface ModuleStep {
  title: string;
  description: string;
  details?: string;
}

export interface ModuleShellProps {
  id: string;
  title: string;
  subtitle: string;
  introTitle: string;
  intro: string[];
  steps: ModuleStep[];
  checklist: { id: string; label: string }[];
  tips: string[];
  children?: React.ReactNode;
}

export default function ModuleShell({
  id,
  title,
  subtitle,
  introTitle,
  intro,
  steps,
  checklist,
  tips,
  children,
}: ModuleShellProps) {
  const [, navigate] = useLocation();
  const [checked, setCheckedState] = useState<string[]>([]);

  useEffect(() => {
    setCheckedState(getChecked(id));
  }, [id]);

  const toggle = (itemId: string) => {
    const next = checked.includes(itemId) ? checked.filter((c) => c !== itemId) : [...checked, itemId];
    setCheckedState(next);
    setChecked(id, next);
  };

  const completion = checklist.length ? Math.round((checked.length / checklist.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Kopf */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zum Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-1">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </header>

      <main className="container py-10 space-y-10">
        {/* Einführung */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">{introTitle}</h2>
          {intro.map((p, i) => (
            <p key={i} className="text-foreground/90 mb-3 leading-relaxed">{p}</p>
          ))}
        </Card>

        {/* Fortschritt */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Meine Checkliste</h3>
            </div>
            <span className="text-sm font-semibold text-primary">{completion}% erledigt</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Der Fortschritt wird lokal in deinem Browser gespeichert – kein Konto erforderlich.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {checklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  checked.includes(item.id) ? 'border-green-300 bg-green-50 dark:bg-green-950/30' : 'border-border hover:bg-muted/50'
                }`}
              >
                <Checkbox checked={checked.includes(item.id)} onCheckedChange={() => toggle(item.id)} />
                <span className={`text-sm ${checked.includes(item.id) ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* Schritte */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">So funktioniert&apos;s – Schritt für Schritt</h2>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                    {step.details && <p className="text-sm text-foreground/80 leading-relaxed">{step.details}</p>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Zusätzliche Sektionen (Datenbank-Listen etc.) */}
        {children}

        {/* Tipps */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-foreground">Expertentipps</h3>
          </div>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground/90">
                <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      </main>
    </div>
  );
}
