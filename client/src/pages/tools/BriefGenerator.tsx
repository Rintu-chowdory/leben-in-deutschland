import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft, Mail, Copy, Check } from "lucide-react";

// Behördenbrief-Generator: Vorlagen für typische Briefe an Behörden & Firmen.
// Fülle die Felder aus – fertig ist ein sauberer, höflicher Brief.

type VorlageId = 'adressaenderung' | 'termin' | 'widerspruch' | 'kuendigung' | 'akteneinsicht';

interface Vorlage {
  id: VorlageId;
  titel: string;
  beschreibung: string;
  empfaengerLabel: string;
  felder: { key: string; label: string; platzhalter: string; area?: boolean }[];
  bau: (f: Record<string, string>) => string;
}

const datumHeute = () =>
  new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

const fuss = (f: Record<string, string>) =>
  `${f.name}\n${f.anschrift}\n\n\n\n${f.empfaenger}\n\n\n\n                                  ${datumHeute()}`;

const vorlagen: Vorlage[] = [
  {
    id: 'adressaenderung',
    titel: 'Adressänderung mitteilen',
    beschreibung: 'Neue Anschrift an Ämter, Banken, Versicherungen, Arbeitgeber melden (§ 17 BMG: Anmeldung beim Bürgeramt separat!)',
    empfaengerLabel: 'Amt / Firma (Name und Anschrift)',
    felder: [
      { key: 'name', label: 'Dein Name', platzhalter: 'Max Mustermann' },
      { key: 'anschrift', label: 'Deine neue Anschrift', platzhalter: 'Musterstraße 1, 12345 Musterstadt' },
      { key: 'empfaenger', label: 'Empfänger', platzhalter: 'Stadt Musterstadt, Bürgeramt, Am Rathaus 1, 12345 Musterstadt' },
    ],
    bau: (f) =>
      `${fuss(f)}\n\nAdressänderung\n\nSehr geehrte Damen und Herren,\n\nhiermit teile ich Ihnen meine neue Anschrift mit:\n\n${f.anschrift}\n\nIch bitte Sie, meine Daten in Ihren Unterlagen entsprechend zu aktualisieren. Sofern eine Anzeige der neuen Anschrift vorgeschrieben ist, erfülle ich diese Mitteilung hiermit.\n\nFür Rückfragen stehe ich Ihnen gerne zur Verfügung.\n\nMit freundlichen Grüßen\n${f.name}`,
  },
  {
    id: 'termin',
    titel: 'Termin anfragen',
    beschreibung: 'Höfliche Anfrage nach einem Termin, z. B. Anmeldung, Verlängerung, Ausgabe',
    empfaengerLabel: 'Amt (Name und Anschrift)',
    felder: [
      { key: 'name', label: 'Dein Name', platzhalter: 'Max Mustermann' },
      { key: 'anschrift', label: 'Deine Anschrift', platzhalter: 'Musterstraße 1, 12345 Musterstadt' },
      { key: 'empfaenger', label: 'Empfänger', platzhalter: 'Bürgeramt Musterstadt, Am Rathaus 1, 12345 Musterstadt' },
      { key: 'anliegen', label: 'Worum geht es?', platzhalter: 'Anmeldung meines Wohnsitzes', area: true },
      { key: 'zeit', label: 'Gewünschte Zeiten', platzhalter: 'Vormittags oder freitags', area: false },
    ],
    bau: (f) =>
      `${fuss(f)}\n\nTerminanfrage: ${f.anliegen || '–'}\n\nSehr geehrte Damen und Herren,\n\nfür ${f.anliegen?.toLowerCase() || 'mein Anliegen'} benötige ich einen Termin in Ihrem Amt. Gerne komme ich zu folgenden Zeiten: ${f.zeit || 'jederzeit'}.\n\nIch bitte um einen Terminvorschlag mit Angabe der mitzubringenden Unterlagen.\n\nMit freundlichen Grüßen\n${f.name}`,
  },
  {
    id: 'widerspruch',
    titel: 'Widerspruch einlegen',
    beschreibung: 'Widerspruch gegen einen Bescheid – wichtig: innerhalb der Widerspruchsfrist (meist 1 Monat)',
    empfaengerLabel: 'Behörde, die den Bescheid geschickt hat',
    felder: [
      { key: 'name', label: 'Dein Name', platzhalter: 'Max Mustermann' },
      { key: 'anschrift', label: 'Deine Anschrift', platzhalter: 'Musterstraße 1, 12345 Musterstadt' },
      { key: 'empfaenger', label: 'Behörde', platzhalter: 'Stadt Musterstadt, Ausländerbehörde, Am Rathaus 1, 12345 Musterstadt' },
      { key: 'aktenzeichen', label: 'Aktenzeichen (steht oben im Bescheid)', platzhalter: 'AB 12/34-5678' },
      { key: 'bescheid', label: 'Bescheid vom / wogegen', platzhalter: 'Ablehnung meines Antrags vom 01.03.', area: true },
      { key: 'gruende', label: 'Deine Gründe', platzhalter: 'Ich habe alle Unterlagen fristgerecht eingereicht (siehe Anlage).', area: true },
    ],
    bau: (f) =>
      `${fuss(f)}\n\nWiderspruch gegen den Bescheid vom ${f.bescheid || '–'}\nAktenzeichen: ${f.aktenzeichen || '–'}\n\nSehr geehrte Damen und Herren,\n\ngleichen hiermit lege ich Widerspruch gegen den oben genannten Bescheid ein.\n\nBegründung:\n${f.gruende || '–'}\n\nIch bitte um schriftliche Bestätigung des Eingangs dieses Widerspruchs sowie um eine erneute Prüfung meines Anliegens. Das Ruhen der Vollziehung beantrage ich hilfsweise.\n\nMit freundlichen Grüßen\n${f.name}\n\nAnlagen: (hier auflisten)`,
  },
  {
    id: 'kuendigung',
    titel: 'Vertrag kündigen',
    beschreibung: 'Kündigung eines Vertrags (Fitnessstudio, Handy, Abo, Versicherung)',
    empfaengerLabel: 'Firma (Name und Anschrift)',
    felder: [
      { key: 'name', label: 'Dein Name', platzhalter: 'Max Mustermann' },
      { key: 'anschrift', label: 'Deine Anschrift', platzhalter: 'Musterstraße 1, 12345 Musterstadt' },
      { key: 'empfaenger', label: 'Empfänger (Firma)', platzhalter: 'Muster-Fitness GmbH, Kundenservice, Industriestraße 2, 12345 Musterstadt' },
      { key: 'vertrag', label: 'Vertragsart & Nummer', platzhalter: 'Mitgliedschaft Nr. 12345678' },
      { key: 'datum', label: 'Kündigung zum', platzhalter: 'nächstmöglichen Termin' },
    ],
    bau: (f) =>
      `${fuss(f)}\n\nKündigung meines Vertrags\n\nSehr geehrte Damen und Herren,\n\nhiermit kündige ich meinen Vertrag (${f.vertrag || '–'}) ${f.datum && f.datum !== 'nächstmöglichen Termin' ? `zum ${f.datum}` : 'fristgerecht zum nächstmöglichen Termin'}.\n\nIch bitte um schriftliche Bestätigung der Kündigung sowie um die Angabe des Beitragsende. Eine Einwilligung in Werbeanrufe oder E-Mails erteile ich nicht.\n\nMit freundlichen Grüßen\n${f.name}`,
  },
  {
    id: 'akteneinsicht',
    titel: 'Akteneinsicht beantragen',
    beschreibung: 'Dein Recht, die Akten über dich einzusehen (§ 29 VwVfG)',
    empfaengerLabel: 'Behörde, bei der deine Akte liegt',
    felder: [
      { key: 'name', label: 'Dein Name', platzhalter: 'Max Mustermann' },
      { key: 'anschrift', label: 'Deine Anschrift', platzhalter: 'Musterstraße 1, 12345 Musterstadt' },
      { key: 'empfaenger', label: 'Behörde', platzhalter: 'Stadt Musterstadt, Am Rathaus 1, 12345 Musterstadt' },
      { key: 'verfahren', label: 'Um welches Verfahren geht es?', platzhalter: 'Antrag Aufenthaltstitel vom 01.03.', area: true },
    ],
    bau: (f) =>
      `${fuss(f)}\n\nAntrag auf Akteneinsicht nach § 29 VwVfG\n\nSehr geehrte Damen und Herren,\n\nhiermit beantrage ich Einsicht in die Akten des Verfahrens: ${f.verfahren || '–'}.\n\nNach § 29 des Verwaltungsverfahrensgesetzes habe ich das Recht, die mich betreffenden Akten einzusehen. Ich bitte um Terminvorschlag oder um Übersendung der relevanten Unterlagen.\n\nMit freundlichen Grüßen\n${f.name}`,
  },
];

export default function BriefGenerator() {
  const [, navigate] = useLocation();
  const [vorlage, setVorlage] = useState<Vorlage>(vorlagen[0]);
  const [werte, setWerte] = useState<Record<string, string>>({});
  const [kopiert, setKopiert] = useState(false);

  const brief = vorlage.bau(Object.fromEntries(vorlage.felder.map((f) => [f.key, werte[f.key] || f.platzhalter])));

  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2000);
    } catch { /* clipboard evtl. blockiert */ }
  };

  const setWert = (k: string, v: string) => setWerte((w) => ({ ...w, [k]: v }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zum Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Mail className="w-8 h-8 text-primary" /> Behördenbrief-Generator
          </h1>
          <p className="text-muted-foreground">Fertige Briefe für typische Situationen – einfach ausfüllen, kopieren, abschicken</p>
        </div>
      </header>

      <main className="container py-10 max-w-4xl space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {vorlagen.map((v) => (
            <button
              key={v.id}
              onClick={() => { setVorlage(v); setKopiert(false); }}
              className={`text-left p-4 rounded-xl border transition-all ${vorlage.id === v.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'}`}
            >
              <h3 className={`font-semibold text-sm ${vorlage.id === v.id ? 'text-primary' : 'text-foreground'}`}>{v.titel}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{v.beschreibung}</p>
            </button>
          ))}
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-foreground">Deine Angaben</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {vorlage.felder.map((f) => (
              <div key={f.key} className={`space-y-2 ${f.area ? 'md:col-span-2' : ''}`}>
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.area ? (
                  <Textarea
                    id={f.key} placeholder={f.platzhalter} value={werte[f.key] || ''}
                    onChange={(e) => setWert(f.key, e.target.value)} rows={2}
                  />
                ) : (
                  <Input
                    id={f.key} placeholder={f.platzhalter} value={werte[f.key] || ''}
                    onChange={(e) => setWert(f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Dein Brief</h2>
            <Button size="sm" onClick={kopieren}>
              {kopiert ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {kopiert ? 'Kopiert!' : 'Brief kopieren'}
            </Button>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm bg-muted/60 dark:bg-slate-900 rounded-lg p-4 text-foreground max-h-[28rem] overflow-y-auto">{brief}</pre>
        </Card>

        <p className="text-xs text-muted-foreground">
          Tipp: Schicke wichtige Briefe per Post und behalte eine Kopie. Bei Widersprüchen zählt das Datum des Poststempels –
          rechtzeitig abschicken! Keine Rechtsberatung.
        </p>
      </main>
    </div>
  );
}
