import ModuleShell from "@/components/ModuleShell";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Clock, ExternalLink, FileText } from "lucide-react";

// Statische Übersicht der wichtigsten Aufenthaltstitel (Fassung 2024/25, vereinfacht)
const statischeTitel = [
  { code: '§ 18g', name: 'Blaue Karte EU', desc: 'Für Hochqualifizierte: Gehalt ab ca. 48.300 € (2025, Engpassberufe niedriger). Erleichterter Familiennachzug, Daueraufenthalt nach 21–27 Monaten.', valid: 'Bis 4 Jahre', zeit: '2–6 Wochen' },
  { code: '§ 18a', name: 'Fachkräfte mit akademischer Ausbildung', desc: 'Für Absolventen deutscher oder anerkannter ausländischer Hochschulabschlüsse mit Arbeitsvertrag.', valid: 'Bis 4 Jahre', zeit: '4–8 Wochen' },
  { code: '§ 18b', name: 'Fachkräfte mit Berufsausbildung', desc: 'Für anerkannte Berufsausbildungen (mindestens 2 Jahre) mit konkretem Arbeitsplatzangebot.', valid: 'Bis 4 Jahre', zeit: '4–8 Wochen' },
  { code: '§ 16b', name: 'Aufenthalt zum Studium', desc: 'Für Studienbewerber:innen und Studenten an deutschen Hochschulen; Nebentätigkeit bis 20 Std./Woche erlaubt.', valid: '1–2 Jahre, verlängerbar', zeit: '4–8 Wochen' },
  { code: '§ 29', name: 'Familiennachzug', desc: 'Für Ehepartner:innen und Kinder von Aufenthaltsberechtigten – teilweise mit einfachen Deutschkenntnissen (A1).', valid: 'Meist 1–3 Jahre', zeit: '8–12 Wochen' },
  { code: '§ 9', name: 'Niederlassungserlaubnis', desc: 'Unbefristeter Aufenthaltstitel nach i. d. R. 3–5 Jahren (mit Integrationskurs und B1).', valid: 'Unbefristet', zeit: '8–12 Wochen' },
];

export default function VisaModule() {
  const { isAuthenticated } = useAuth();
  const [selectedPermit, setSelectedPermit] = useState<string | null>('§ 18g');

  const { data: permits, isLoading } = trpc.visa.getPermitTypes.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const titel = permits && permits.length > 0
    ? permits.map((p) => ({ code: p.code, name: p.name, desc: p.description, valid: p.validityPeriod, zeit: p.processingTime }))
    : statischeTitel;

  const gewaehlt = titel.find((t) => t.code === selectedPermit) ?? titel[0];

  return (
    <ModuleShell
      id="visa"
      title="Visum & Aufenthaltstitel"
      subtitle="Aufenthaltstitel, Blaue Karte EU und Verlängerungen verstehen"
      introTitle="Aufenthalt in Deutschland – was gilt für wen?"
      intro={[
        'EU-Bürger:innen (inkl. Island, Liechtenstein, Norwegen, Schweiz) brauchen kein Visum und keine Aufenthaltserlaubnis – nur die Anmeldung beim Bürgeramt (Freizügigkeit).',
        'Für Drittstaatsangehörige gibt es seit der Reform des Fachkräfteeinwanderungsgesetzes (2024) viele Wege: Blaue Karte EU, Fachkräfte-Visa, Studium, Familiennachzug oder die neue Chancenkarte (§ 20a) mit Punktesystem.',
        'Zuständig ist in Deutschland die Ausländerbehörde deiner Stadt (in Berlin: Landesamt für Einwanderung). Der Schlüssel für einen reibungslosen Prozess: vollständige Unterlagen und früh gebuchte Termine.',
      ]}
      steps={[
        {
          title: 'Status klären',
          description: 'EU-Bürger? Freizügigkeit. Drittstaat? Du brauchst vor der Einreise i. d. R. ein Visum bei der deutschen Botschaft.',
          details: 'Für manche Staaten (USA, UK, Australien, Japan u. a.) gilt Visumfreiheit – du kannst als Tourist einreisen und vor Ort die Aufenthaltserlaubnis beantragen.',
        },
        {
          title: 'Termin bei der Ausländerbehörde',
          description: 'Termine sind knapp – buche so früh wie möglich (in Berlin über die Terminals des Landesamts für Einwanderung).',
          details: 'Viele Behörden verlangen, dass du die Antragsunterlagen vorab per E-Mail einreichst. Beantworte Rückfragen zügig, sonst verfällt der Termin.',
        },
        {
          title: 'Unterlagen zusammenstellen',
          description: 'Reisepass, biometrisches Foto, Arbeitsvertrag, Meldebescheinigung, Finanzierungsnachweis und je nach Titel: Zeugnisse, Anerkennung, Sprachzertifikat.',
          details: 'Zeugnisse aus dem Ausland müssen oft über die Zentralstelle für ausländisches Bildungswesen (anabin/ZAB) anerkannt werden – der Prozess dauert 1–3 Monate.',
        },
        {
          title: 'Antrag stellen und Fingerabdrücke',
          description: 'Der elektronische Aufenthaltstitel (eAT) ist eine Karte – dafür werden Fingerabdrücke und Fotos an der Behörde aufgenommen.',
          details: 'Der eAT kommt per Post nach ca. 4–8 Wochen. Bis dahin bekommst du ggf. eine Fiktionsbescheinigung, die dich legal arbeiten lässt.',
        },
        {
          title: 'Verlängerung nicht verpassen',
          description: 'Beantrage die Verlängerung 6–8 Wochen vor Ablauf – rechtzeitig, sonst drohen Bußgeld und Probleme beim Arbeitgeber.',
          details: 'Alle Fristen kannst du im Fristen-Rechner speichern und überwachen.',
        },
      ]}
      checklist={[
        { id: 'pass', label: 'Reisepass (mindestens 6 Monate gültig)' },
        { id: 'foto', label: 'Biometrisches Passfoto (35×45 mm)' },
        { id: 'meldung', label: 'Meldebescheinigung (nach Anmeldung)' },
        { id: 'arbeit', label: 'Arbeitsvertrag oder Studienplatznachweis' },
        { id: 'finanzen', label: 'Finanzierungsnachweis (Verdiensstufe, Sperrkonto oder Verpflichtungserklärung)' },
      ]}
      tips={[
        'Die Chancenkarte (§ 20a) erlaubt seit Juni 2024 die Einreise zur Arbeitsuche ohne festen Arbeitsvertrag – Punkte für Alter, Ausbildung, Deutschkenntnisse.',
        'Dokumente auf Englisch oder Deutsch reichen bei den meisten Behörden – alles andere muss von einem vereidigten Dolmetscher übersetzt werden.',
        'Anerkennung ausländischer Abschlüsse: Start mit dem Anerkennungs-Finder der Bundesagentur für Arbeit (anabin-Datenbank).',
        'Falls dein Visum abläuft und die Verlängerung noch läuft: Die Fiktionsbescheinigung schützt dich vor Problemen beim Arbeitgeber und bei der Ausreise.',
      ]}
    >
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Aufenthaltstitel im Überblick</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {titel.map((t) => (
            <button
              key={t.code}
              onClick={() => setSelectedPermit(t.code)}
              className={`text-left p-5 rounded-xl border-2 transition-all ${
                gewaehlt?.code === t.code ? 'border-primary bg-primary/5 shadow-lg' : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="text-xs font-bold text-primary mb-1">{t.code}</p>
              <p className="font-semibold text-foreground">{t.name}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.desc}</p>
            </button>
          ))}
        </div>

        {gewaehlt && (
          <div className="mt-8 p-6 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-foreground">{gewaehlt.code} – {gewaehlt.name}</h3>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{gewaehlt.desc}</p>
            <div className="flex flex-wrap gap-4 mt-4">
              {gewaehlt.valid && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" /> Geltungsdauer: {gewaehlt.valid}
                </span>
              )}
              {gewaehlt.zeit && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" /> Bearbeitung: ca. {gewaehlt.zeit}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <a href="https://www.make-it-in-germany.com/de/" target="_blank" rel="noopener noreferrer" className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors">
            <p className="font-semibold text-foreground flex items-center gap-2">Make it in Germany <ExternalLink className="w-3.5 h-3.5" /></p>
            <p className="text-sm text-muted-foreground mt-1">Offizielles Portal der Bundesregierung zu Einwanderung</p>
          </a>
          <a href="https://digital.diplo.de/" target="_blank" rel="noopener noreferrer" className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors">
            <p className="font-semibold text-foreground flex items-center gap-2">Visumsuche des Auswärtigen Amts <ExternalLink className="w-3.5 h-3.5" /></p>
            <p className="text-sm text-muted-foreground mt-1">Individuelle Visum-Anforderungen prüfen</p>
          </a>
        </div>

        {isLoading && <p className="text-center text-muted-foreground mt-4">Titel werden geladen…</p>}
      </Card>
    </ModuleShell>
  );
}
