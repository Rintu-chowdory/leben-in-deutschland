import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useMemo, useState } from "react";
import { ArrowLeft, CalendarHeart, PartyPopper } from "lucide-react";

// Feiertags-Check: gesetzliche Feiertage pro Bundesland (2026/2027)
// mit Countdown zum nächsten freien Tag.

interface Feiertag {
  datum: string; // YYYY-MM-DD
  name: string;
  laender: string[] | 'alle';
  hinweis?: string;
}

const JA = 'alle';

const feiertage: Feiertag[] = [
  // 2026 (Ostersonntag: 5. April 2026)
  { datum: '2026-01-01', name: 'Neujahr', laender: JA },
  { datum: '2026-01-06', name: 'Heilige Drei Könige', laender: ['BW', 'BY', 'ST'] },
  { datum: '2026-04-03', name: 'Karfreitag', laender: JA },
  { datum: '2026-04-05', name: 'Ostersonntag', laender: ['BB'], hinweis: 'Nur Brandenburg' },
  { datum: '2026-04-06', name: 'Ostermontag', laender: JA },
  { datum: '2026-05-01', name: 'Tag der Arbeit', laender: JA },
  { datum: '2026-05-14', name: 'Christi Himmelfahrt', laender: JA },
  { datum: '2026-05-25', name: 'Pfingstmontag', laender: JA },
  { datum: '2026-06-04', name: 'Fronleichnam', laender: ['BW', 'BY', 'HB', 'HE', 'NW', 'RP', 'SL'] },
  { datum: '2026-08-15', name: 'Mariä Himmelfahrt', laender: ['SL'], hinweis: 'Saarland (teilw. nur kath. Gemeinden)' },
  { datum: '2026-10-03', name: 'Tag der Deutschen Einheit', laender: JA },
  { datum: '2026-10-31', name: 'Reformationstag', laender: ['BB', 'BE', 'HB', 'HH', 'MV', 'NI', 'SN', 'SH', 'SL', 'ST', 'TH'] },
  { datum: '2026-11-01', name: 'Allerheiligen', laender: ['BW', 'BY', 'NW', 'RP', 'SL'] },
  { datum: '2026-11-18', name: 'Buß- und Bettag', laender: ['SN'], hinweis: 'Nur Sachsen' },
  { datum: '2026-12-25', name: '1. Weihnachtstag', laender: JA },
  { datum: '2026-12-26', name: '2. Weihnachtstag', laender: JA },
  // 2027 (Ostersonntag: 28. März 2027)
  { datum: '2027-01-01', name: 'Neujahr', laender: JA },
  { datum: '2027-01-06', name: 'Heilige Drei Könige', laender: ['BW', 'BY', 'ST'] },
  { datum: '2027-03-26', name: 'Karfreitag', laender: JA },
  { datum: '2027-03-28', name: 'Ostermontag', laender: JA },
  { datum: '2027-05-01', name: 'Tag der Arbeit', laender: JA },
  { datum: '2027-05-06', name: 'Christi Himmelfahrt', laender: JA },
  { datum: '2027-05-17', name: 'Pfingstmontag', laender: JA },
  { datum: '2027-05-27', name: 'Fronleichnam', laender: ['BW', 'BY', 'HB', 'HE', 'NW', 'RP', 'SL'] },
  { datum: '2027-10-03', name: 'Tag der Deutschen Einheit', laender: JA },
  { datum: '2027-10-31', name: 'Reformationstag', laender: ['BB', 'BE', 'HB', 'HH', 'MV', 'NI', 'SN', 'SH', 'SL', 'ST', 'TH'] },
  { datum: '2027-11-01', name: 'Allerheiligen', laender: ['BW', 'BY', 'NW', 'RP', 'SL'] },
  { datum: '2027-12-25', name: '1. Weihnachtstag', laender: JA },
  { datum: '2027-12-26', name: '2. Weihnachtstag', laender: JA },
];

const bundeslaender: { code: string; name: string }[] = [
  { code: 'BW', name: 'Baden-Württemberg' },
  { code: 'BY', name: 'Bayern' },
  { code: 'BE', name: 'Berlin' },
  { code: 'BB', name: 'Brandenburg' },
  { code: 'HB', name: 'Bremen' },
  { code: 'HH', name: 'Hamburg' },
  { code: 'HE', name: 'Hessen' },
  { code: 'MV', name: 'Mecklenburg-Vorpommern' },
  { code: 'NI', name: 'Niedersachsen' },
  { code: 'NW', name: 'Nordrhein-Westfalen' },
  { code: 'RP', name: 'Rheinland-Pfalz' },
  { code: 'SL', name: 'Saarland' },
  { code: 'SN', name: 'Sachsen' },
  { code: 'ST', name: 'Sachsen-Anhalt' },
  { code: 'SH', name: 'Schleswig-Holstein' },
  { code: 'TH', name: 'Thüringen' },
];

function tageBis(datumIso: string): number {
  const d = new Date(datumIso + 'T00:00:00');
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - heute.getTime()) / 86400000);
}

function formatDatum(datumIso: string): string {
  return new Date(datumIso + 'T00:00:00').toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export default function Feiertage() {
  const [, navigate] = useLocation();
  const [land, setLand] = useState('NW');

  const { heuteFrei, naechster, liste } = useMemo(() => {
    const relevant = feiertage
      .filter((f) => f.laender === 'alle' || f.laender.includes(land))
      .sort((a, b) => a.datum.localeCompare(b.datum));
    const heuteIso = new Date().toISOString().slice(0, 10);
    const heuteFrei = relevant.find((f) => f.datum === heuteIso) ?? null;
    const naechster = relevant.find((f) => tageBis(f.datum) > 0) ?? null;
    return { heuteFrei, naechster, liste: relevant };
  }, [land]);

  const count2026 = liste.filter((f) => f.datum.startsWith('2026')).length;
  const count2027 = liste.filter((f) => f.datum.startsWith('2027')).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zum Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <CalendarHeart className="w-8 h-8 text-primary" /> Feiertags-Check
          </h1>
          <p className="text-muted-foreground">Wann ist frei in deinem Bundesland? Countdown inklusive</p>
        </div>
      </header>

      <main className="container py-10 max-w-3xl space-y-6">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="space-y-2 flex-1">
              <p className="text-sm font-medium text-foreground">Dein Bundesland</p>
              <Select value={land} onValueChange={setLand}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {bundeslaender.map((b) => (
                    <SelectItem key={b.code} value={b.code}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-center px-6 py-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <p className="text-sm text-white/80">Freie Tage</p>
              <p className="text-2xl font-bold">{count2026} <span className="text-sm font-normal text-white/80">2026 · {count2027} 2027</span></p>
            </div>
          </div>
        </Card>

        {heuteFrei && (
          <Card className="p-6 bg-gradient-to-r from-amber-500/15 to-purple-500/15 border-primary/40 flex items-center gap-4">
            <PartyPopper className="w-8 h-8 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Heute ist {heuteFrei.name}! 🎉</p>
              <p className="text-sm text-muted-foreground">Genieß den freien Tag.</p>
            </div>
          </Card>
        )}

        {naechster && (
          <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
            <p className="text-white/80 text-sm font-medium">Nächster Feiertag</p>
            <p className="text-2xl font-bold mt-1">{naechster.name}</p>
            <p className="text-white/85 mt-1">{formatDatum(naechster.datum)}</p>
            <p className="text-white/80 text-sm mt-3">
              Noch <strong className="text-white">{tageBis(naechster.datum)}</strong> Tage –
              {' '}{new Date(naechster.datum + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long' })}
            </p>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="font-semibold text-foreground mb-4">Alle Feiertage 2026/2027</h2>
          <div className="space-y-1">
            {liste.map((f) => {
              const tage = tageBis(f.datum);
              const vorbei = tage < 0;
              const istHeute = tage === 0;
              return (
                <div
                  key={f.datum + f.name}
                  className={`flex items-center justify-between gap-4 py-3 px-3 rounded-lg ${istHeute ? 'bg-primary/10' : vorbei ? 'opacity-50' : 'hover:bg-muted/60'} transition-colors`}
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDatum(f.datum)} {f.hinweis ? `· ${f.hinweis}` : ''}
                    </p>
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap ${istHeute ? 'text-primary' : 'text-muted-foreground'}`}>
                    {istHeute ? 'Heute!' : vorbei ? 'vorbei' : `in ${tage} Tagen`}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <p className="text-xs text-muted-foreground">
          Grundlage: gesetzliche Feiertage der Länder. Regionale Besonderheiten (z. B. Augsburger Friedensfest,
          Fronleichnam in Teilen von SN/TH) können abweichen.
        </p>
      </main>
    </div>
  );
}
