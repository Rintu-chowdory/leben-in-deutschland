import ModuleShell from "@/components/ModuleShell";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ExternalLink, Landmark, Percent } from "lucide-react";

export default function BankModule() {
  const { isAuthenticated } = useAuth();
  const { data: banks } = trpc.banks.getRecommendations.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const fallbackBanks = [
    { name: 'DKB (Deutsche Kreditbank)', desc: 'Kostenloses Girokonto ab Geldeingang, kostenlose Bargeldauszahlung weltweit, Video-Ident', url: 'https://www.dkb.de' },
    { name: 'N26', desc: 'Rein digitales Konto, Eröffnung per App in ca. 8 Minuten, englische App verfügbar', url: 'https://n26.com/de' },
    { name: 'Commerzbank', desc: 'Filialnetz + App, Girokonto oft kostenlos für Studenten/Azubis', url: 'https://www.commerzbank.de' },
    { name: '1822direkt / ING', desc: 'Kostenlose Konten mit Kaufhof-freier Führung, gute Zinsen für Neukunden', url: 'https://www.ing.de' },
  ];

  const shown = banks && banks.length > 0 ? null : fallbackBanks;

  return (
    <ModuleShell
      id="bank"
      title="Bankkonto eröffnen"
      subtitle="Dein Geld braucht eine Adresse – Kontoeröffnung Schritt für Schritt"
      introTitle="Warum brauche ich ein deutsches Konto?"
      intro={[
        'Ein deutsches Girokonto ist fast unverzichtbar: Gehalt wird darauf überwiesen, Miete und Rundfunkbeitrag werden per Lastschrift gezogen, und für die Wohnungssuche brauchst oft einen Kontoauszug als Finanzierungsnachweis.',
        'Ohne SCHUFA-Historie und mit ausländischem Pass funktioniert die Eröffnung trotzdem – fast alle Direktbanken bieten Video-Ident oder Post-Ident zur Legitimation an.',
      ]}
      steps={[
        {
          title: 'Kontoart wählen',
          description: 'Girokonto (Standard), Basiskonto (gesetzlicher Anspruch für EU-Bürger) oder Festgeldkonto.',
          details: 'Wer abgelehnt wird, hat seit 2016 das Recht auf ein „Basiskonto“ (Kontoführung für alle, § 31 Zahlungskontogesetz). Jede Bank in Deutschland ist verpflichtet, dir eines anzubieten.',
        },
        {
          title: 'Antrag online ausfüllen',
          description: 'Persönliche Daten, Anschrift (mit Meldebescheinigung!) und Steuerdaten eintragen.',
          details: 'Deine Meldeadresse muss mit der Anmeldung übereinstimmen – ohne Anmeldung wird es bei den meisten Banken schwierig.',
        },
        {
          title: 'Legitimation per Video-Ident oder Post-Ident',
          description: 'Deine Identität wird überprüft – per Webcam-Gespräch oder in einer Postfiliale.',
          details: 'Video-Ident dauert ca. 5–10 Minuten und funktioniert mit jedem Smartphone. Du brauchst deinen Reisepass und ggf. einen zweiten Ausweis.',
        },
        {
          title: 'Karte empfangen und aktivieren',
          description: 'Innerhalb von 3–10 Werktagen kommen Girocard und Kreditkarte per Post.',
          details: 'PIN kommt separat. Aktivierung meist per App. Direkt danach: Daueraufräge einrichten (Miete, Rundfunkbeitrag, Handyvertrag).',
        },
        {
          title: 'Gehalt und Zahlungen verbinden',
          description: 'Teile die IBAN deinem Arbeitgeber mit und richte Überweisungen ein.',
          details: 'Für die Erstattung von Krankenversicherung und Steuern wird ebenfalls die IBAN benötigt – alles über die jeweiligen Portale.',
        },
      ]}
      checklist={[
        { id: 'pass', label: 'Reisepass (bei Drittstaatsangehörigkeit mit Sichtvermerk)' },
        { id: 'meldung', label: 'Meldebescheinigung (erhältst du bei der Anmeldung)' },
        { id: 'aufenthalt', label: 'Aufenthaltstitel (falls nicht EU-Bürger)' },
        { id: 'einkommen', label: 'Einkommensnachweis oder Arbeitsvertrag (optional aber hilfreich)' },
        { id: 'video', label: 'Smartphone/Laptop für Video-Ident bereit' },
      ]}
      tips={[
        'Falls eine Bank dich ablehnt: Frag nach einem Basiskonto – das haben sie dir per Gesetz anzubieten.',
        'Vergleiche nicht nur Kontoführung, sondern auch kostenlose Bargeldauszahlung und Kreditkarte. Die Verbraucherzentrale hat einen Girokonto-Vergleich.',
        'Für Studenten und Azubis sind fast alle Konten kostenlos – den Status musst du nur nachweisen.',
        'Die IBAN deiner deutschen Bank beginnt mit DE + zwei Prüfziffern – sie ist für alle Geldbewegungen in Europa nötig.',
      ]}
    >
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Bank-Empfehlungen</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {banks && banks.length > 0 ? 'Live-Daten aus unserer Datenbank.' : 'Diese Auswahl ist unabhängig und ohne Provision – der Live-Vergleich aus der Datenbank ist im Gast-Modus nicht verfügbar.'}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {banks && banks.length > 0 ? (
            banks.map((b) => (
              <a
                key={b.id}
                href={b.affiliateLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors block"
              >
                <p className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
                  <Landmark className="w-4 h-4 text-primary" /> {b.name}
                  {b.accountOpeningBonus && (
                    <span className="text-xs font-bold text-green-700 bg-green-100 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Percent className="w-3 h-3" />{b.accountOpeningBonus}
                    </span>
                  )}
                  {b.englishSupport && <span className="text-xs text-muted-foreground">🌐 Englischer Support</span>}
                </p>
                {b.features && b.features.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">{b.features.slice(0, 3).join(' · ')}</p>
                )}
                {b.monthlyFee && <p className="text-xs text-muted-foreground mt-1">Kontoführung: {b.monthlyFee}</p>}
              </a>
            ))
          ) : (
            shown!.map((b) => (
              <a
                key={b.name}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors block"
              >
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-primary" /> {b.name} <ExternalLink className="w-3.5 h-3.5" />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{b.desc}</p>
              </a>
            ))
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          Keine Finanzberatung – vergleiche Konditionen selbst. Für echte Vergleichsportale: check24.de oder finanzfluss.de.
        </p>
      </Card>
    </ModuleShell>
  );
}
