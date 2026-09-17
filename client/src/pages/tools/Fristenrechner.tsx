import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarClock, Home, Car, Baby, GraduationCap, Trash2, AlertTriangle } from "lucide-react";
import { getDeadline, setDeadline, clearDeadline } from "@/lib/progress";

// Wichtige behördliche Fristen in Deutschland (vereinfacht, keine Rechtsberatung)
interface FristEvent {
  id: string;
  icon: React.ElementType;
  titel: string;
  beschreibung: string;
  startLabel: string;
  fristen: { tage: number; label: string; link?: string }[];
}

const events: FristEvent[] = [
  {
    id: 'umzug',
    icon: Home,
    titel: 'Umzug / Anmeldung',
    beschreibung: 'Nach dem Einzug in eine neue Wohnung musst du dich innerhalb von 14 Tagen anmelden (§ 17 Bundesmeldegesetz).',
    startLabel: 'Einzugsdatum',
    fristen: [
      { tage: 14, label: 'Anmeldung beim Bürgeramt (Wohnsitzanmeldung) – Pflicht!', link: 'https://www.serviceportal.de' },
      { tage: 14, label: 'Nachmeldung bei Rundfunkbeitrag (ARD ZDF Deutschlandradio)' },
      { tage: 30, label: 'Adresse bei Bank, Versicherungen, Arbeitgeber & Auslandsbehörden aktualisieren' },
    ],
  },
  {
    id: 'auto',
    icon: Car,
    titel: 'Auto ummelden',
    beschreibung: 'Nach einem Umzug muss das Kfz umgemeldet werden; bei Fahrzeugen mit ausländischen Kennzeichen gelten besondere Fristen.',
    startLabel: 'Datum der Ummeldung / des Umzugs',
    fristen: [
      { tage: 14, label: 'Kfz-Ummeldung bei der Zulassungsstelle nach Wohnortwechsel' },
      { tage: 30, label: 'Versicherungsadresse (Kfz-Versicherung) aktualisieren – oft required für Tarif' },
      { tage: 365, label: 'Fahrzeuge aus dem EU-Ausland: spätestens 12 Monate nach Zuzug deutsche Kennzeichen beantragen' },
    ],
  },
  {
    id: 'geburt',
    icon: Baby,
    titel: 'Geburt eines Kindes',
    beschreibung: 'Nach der Geburt laufen mehrere behördliche Fristen – von Standesamt bis Elterngeld.',
    startLabel: 'Geburtsdatum',
    fristen: [
      { tage: 7, label: 'Anzeige beim Standesamt (in den meisten Bundesländern innerhalb von 7 Tagen)' },
      { tage: 63, label: 'Elterngeld beantragen (bis zum 3. Lebensmonat des Kindes, rückwirkend max. 3 Monate)' },
      { tage: 90, label: 'Kindergeld beantragen (Familienkasse) – ohne Antrag keine Zahlung' },
      { tage: 90, label: 'Mutterschutz-/Elternzeit-Formalitäten mit dem Arbeitgeber klären' },
    ],
  },
  {
    id: 'studium',
    icon: GraduationCap,
    titel: 'Studium / BAföG',
    beschreibung: 'Rund ums Studium gibt es Antrags- und Rückmeldefristen.',
    startLabel: 'Semesterbeginn',
    fristen: [
      { tage: 30, label: 'Rückmeldung für das kommende Semester beachten (Fristen der Hochschule prüfen!)' },
      { tage: 60, label: 'BAföG-Antrag frühzeitig stellen – Bearbeitung dauert oft 6–8 Wochen' },
    ],
  },
];

function addDays(iso: string, tage: number): Date {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + tage);
  return d;
}

function daysUntil(d: Date): number {
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - heute.getTime()) / 86400000);
}

export default function Fristenrechner() {
  const [, navigate] = useLocation();
  const [gewaehlt, setGewaehlt] = useState<string>('umzug');
  const [datum, setDatum] = useState('');
  const [gespeichert, setGespeichert] = useState<Record<string, string>>({});

  useEffect(() => {
    const lad = () => {
      const s: Record<string, string> = {};
      events.forEach((e) => {
        const d = getDeadline(e.id);
        if (d) s[e.id] = d;
      });
      setGespeichert(s);
    };
    lad();
    window.addEventListener('lid-progress-changed', lad);
    return () => window.removeEventListener('lid-progress-changed', lad);
  }, []);

  const event = events.find((e) => e.id === gewaehlt)!;
  const aktivesDatum = gespeichert[event.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zum Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <CalendarClock className="w-8 h-8 text-primary" /> Fristen-Rechner
          </h1>
          <p className="text-muted-foreground">Behördliche Fristen nach Lebensereignissen – mit Erinnerungsdaten</p>
        </div>
      </header>

      <main className="container py-10 max-w-3xl space-y-6">
        <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90">
              Die Fristen sind sorgfältig recherchiert, können aber je nach Bundesland und Einzelfall abweichen.
              Verbindliche Auskünfte gibt dir die jeweilige Behörde. Keine Rechtsberatung.
            </p>
          </div>
        </Card>

        {/* Ereignis wählen */}
        <div className="grid gap-3 sm:grid-cols-2">
          {events.map((e) => {
            const Icon = e.icon;
            const aktiv = gewaehlt === e.id;
            const hatDatum = !!gespeichert[e.id];
            return (
              <button
                key={e.id}
                onClick={() => setGewaehlt(e.id)}
                className={`text-left rounded-xl border-2 p-4 transition-all flex items-center gap-3 ${
                  aktiv ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${aktiv ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-muted'}`}>
                  <Icon className={`w-5 h-5 ${aktiv ? 'text-white' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{e.titel}</p>
                  {hatDatum && <p className="text-xs text-primary">Datum gespeichert</p>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Beschreibung */}
        <Card className="p-6">
          <h2 className="font-semibold text-foreground mb-2">{event.titel}</h2>
          <p className="text-sm text-muted-foreground mb-4">{event.beschreibung}</p>

          <label className="block text-sm font-medium text-foreground mb-2">{event.startLabel}</label>
          <div className="flex gap-2 flex-wrap">
            <input
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground"
            />
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              disabled={!datum}
              onClick={() => setDeadline(event.id, datum)}
            >
              Fristen berechnen
            </Button>
            {aktivesDatum && (
              <Button variant="outline" onClick={() => clearDeadline(event.id)}>
                <Trash2 className="w-4 h-4 mr-1" /> Löschen
              </Button>
            )}
          </div>
        </Card>

        {/* Ergebnisse */}
        {aktivesDatum && (
          <div className="space-y-3">
            {event.fristen.map((f, i) => {
              const ziel = addDays(aktivesDatum, f.tage);
              const rest = daysUntil(ziel);
              const vorbei = rest < 0;
              const knapp = rest >= 0 && rest <= 7;
              return (
                <Card
                  key={i}
                  className={`p-5 border-l-4 ${
                    vorbei ? 'border-l-red-500' : knapp ? 'border-l-amber-500' : 'border-l-green-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{f.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Frist: {ziel.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      {f.link && (
                        <a href={f.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">
                          Offizielle Information →
                        </a>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {vorbei ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-full">
                          Frist abgelaufen
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          knapp ? 'text-amber-700 bg-amber-100 dark:bg-amber-900/40' : 'text-green-700 bg-green-100 dark:bg-green-900/40'
                        }`}>
                          {rest === 0 ? 'Heute!' : `noch ${rest} ${rest === 1 ? 'Tag' : 'Tage'}`}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
