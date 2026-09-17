import ModuleShell from "@/components/ModuleShell";
import { Card } from "@/components/ui/card";
import { ExternalLink, Phone, FileText } from "lucide-react";

export default function TaxIDModule() {
  return (
    <ModuleShell
      id="tax"
      title="Steuer-ID & Steuern verstehen"
      subtitle="Die steuerliche Identifikationsnummer und deine Steuerklasse"
      introTitle="Was ist die Steuer-ID?"
      intro={[
        'Die Steuerliche Identifikationsnummer (Steuer-ID, TIN) ist eine elfstellige, lebenslang gültige Nummer, die du für alles Steuerliche in Deutschland brauchst: Arbeitgeber, Bank, Kindergeld, Steuererklärung.',
        'Sie wird dir automatisch nach der Wohnsitzanmeldung vom Bundeszentralamt für Steuern per Post zugeschickt – meist innerhalb von 1–2 Wochen. Du musst nichts beantragen!',
        'Nicht verwechseln mit der Steuernummer des Finanzamts: Die Steuer-ID bleibt immer gleich, die Steuernummer kann sich bei Umzug oder Arbeitgeberwechsel ändern.',
      ]}
      steps={[
        {
          title: 'Wohnung anmelden (Pflicht zuerst)',
          description: 'Die Steuer-ID wird nach der Wohnsitzanmeldung automatisch vom Bundeszentralamt verschickt.',
          details: 'Ohne Anmeldung keine Steuer-ID – die Post geht an deine Meldeadresse. Wenn du sie nach 2 Wochen nicht erhalten hast, kannst du beim BZSt nachfragen.',
        },
        {
          title: 'Bescheid erhalten und aufbewahren',
          description: 'Der Brief vom BZSt enthält deine Steuer-ID – speichere sie digital und schreib sie dir in deinen Pass.',
          details: 'Die Nummer beginnt mit einer Zufallsziffer und endet mit einer Prüfziffer, z. B. „12 345 678 901“. Du wirst sie oft brauchen – Arbeitgeber, Banken, Versicherungen fragen regelmäßig danach.',
        },
        {
          title: 'An den Arbeitgeber weitergeben',
          description: 'Dein Arbeitgeber braucht die Steuer-ID, um dich beim Finanzamt für die Lohnsteuerkarte (ELStAM) zu registrieren.',
          details: 'Ohne Steuer-ID wirst du automatisch in Steuerklasse VI eingestuft – dann zahlt du deutlich zu viel Lohnsteuer. Die Korrektur erfolgt automatisch nach Eingang der Nummer.',
        },
        {
          title: 'Steuerklasse prüfen',
          description: 'Die Steuerklasse beeinflusst, wie viel Lohnsteuer monatlich abgezogen wird.',
          details: 'Verheiratete können die Klassenwahl optimieren (III/V oder IV mit Faktor). Wechsel beantragt man per Formular beim Finanzamt – seit 2020 ist der Wechsel mehrfach im Jahr möglich.',
        },
        {
          title: 'Steuererklärung abgeben (ELSTER)',
          description: 'Bis 31. Juli des Folgejahres kannst du freiwillig oder verpflichtend deine Steuererklärung einreichen.',
          details: 'Für Arbeitnehmer mit einfacher Konstellation ist die Erklärung oft eine Rückerstattung wert (durchschnittlich ca. 1.000 €). Online über ELSTER oder per App (z. B. „SteuerSparErklärung“, WISO, Taxfix).',
        },
      ]}
      checklist={[
        { id: 'anmeldung', label: 'Wohnsitzanmeldung abgeschlossen' },
        { id: 'steuerid', label: 'Steuer-ID vom BZSt erhalten (Brief ca. 1–2 Wochen nach Anmeldung)' },
        { id: 'arbeitgeber', label: 'Steuer-ID an Arbeitgeber weitergegeben' },
        { id: 'steuerklasse', label: 'Steuerklasse geprüft (verheiratet? III/IV/V optimieren?)' },
        { id: 'elster', label: 'ELSTER-Konto für die Steuererklärung angelegt' },
      ]}
      tips={[
        'Steuer-ID verloren? Beim Bundeszentralamt für Steuern unter 0228 / 406 – 1240 anrufen (Mo–Fr 8–18 Uhr) – mit Angabe von Name, Geburtsdatum und Anschrift bekommst du sie telefonisch.',
        'Die Nummer steht auch auf deinem letzten Lohnsteuerabrechnungsblatt oder auf Briefen vom Finanzamt.',
        'Für die Steuererklärung brauchst du: Lohnsteuerbescheinigung, Spendenquittungen, Nachweise über Handwerker- oder Pflegekosten.',
        'Frist-Verlängerung: Wenn du einen Steuerberater beauftragst, verschiebt sich die Abgabefrist auf Ende Februar des übernächsten Jahres.',
      ]}
    >
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Steuer-ID verloren? So bekommst du sie wieder</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Bundeszentralamt für Steuern</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Hotline für Steuer-ID-Rückfragen:
            </p>
            <p className="font-semibold text-foreground">0228 / 406 – 1240</p>
            <p className="text-xs text-muted-foreground mt-1">Mo–Fr 8–18 Uhr · Du brauchst Name, Geburtsdatum, Anschrift</p>
          </div>
          <div className="p-5 rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Wo sonst nachsehen?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Lohnsteuerbescheinigung deines Arbeitgebers</li>
              <li>• Briefe vom Finanzamt (Steuererklärung)</li>
              <li>• Bescheid über Kindergeld oder BAföG</li>
              <li>• Bestätigung der Krankenkasse (Manche Kassen zeigen sie in der App)</li>
            </ul>
          </div>
        </div>

        <h3 className="font-semibold text-foreground mb-4">Offizielle Quellen</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <a href="https://www.bzst.de/" target="_blank" rel="noopener noreferrer" className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors">
            <p className="font-semibold text-foreground flex items-center gap-2">Bundeszentralamt für Steuern <ExternalLink className="w-3.5 h-3.5" /></p>
            <p className="text-sm text-muted-foreground mt-1">Zuständige Behörde für die Steuer-ID</p>
          </a>
          <a href="https://www.elster.de/" target="_blank" rel="noopener noreferrer" className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors">
            <p className="font-semibold text-foreground flex items-center gap-2">ELSTER <ExternalLink className="w-3.5 h-3.5" /></p>
            <p className="text-sm text-muted-foreground mt-1">Offizielles Online-Portal für die Steuererklärung</p>
          </a>
        </div>
      </Card>
    </ModuleShell>
  );
}
