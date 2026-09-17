import ModuleShell from "@/components/ModuleShell";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ExternalLink, Heart } from "lucide-react";

export default function HealthInsuranceModule() {
  const { isAuthenticated } = useAuth();
  const { data: providers } = trpc.healthInsurance.getProviders.useQuery({ type: undefined }, {
    enabled: isAuthenticated,
  });

  const fallbackKassen = [
    { name: 'Techniker Krankenkasse (TK)', url: 'https://www.tk.de' },
    { name: 'AOK (regionale AOKs)', url: 'https://www.aok.de' },
    { name: 'Barmer', url: 'https://www.barmer.de' },
    { name: 'DAK-Gesundheit', url: 'https://www.dak.de' },
  ];

  return (
    <ModuleShell
      id="health"
      title="Krankenversicherung"
      subtitle="Das deutsche Gesundheitssystem verstehen – GKV, PKV und deine Wahl"
      introTitle="Wie funktioniert das deutsche Gesundheitssystem?"
      intro={[
        'In Deutschland ist die Krankenversicherung Pflicht. Fast alle Menschen sind gesetzlich versichert (GKV – ca. 90 %), Gutverdiener und Selbstständige können sich privat versichern (PKV).',
        'Als Arbeitnehmer/in zahlt dein Arbeitgeber automatisch die Hälfte deiner Beiträge – du wirst bei Arbeitsbeginn über den Arbeitgeber in eine Kasse deiner Wahl (bei GKV-Pflicht) eingetragen.',
        'Mit der Versicherungsbescheinigung deiner Krankenkasse kannst du dich bei Ärzt:innen anmelden und Medikamente in der Apotheke abholen (meist 5–10 € Zuzahlung pro Medikament).',
      ]}
      steps={[
        {
          title: 'Pflicht prüfen',
          description: 'Bist du GKV-pflichtversichert (Arbeitnehmer unter der Jahresarbeitsentgeltgrenze)?',
          details: 'Grenzwert 2025: ca. 73.800 € Brutto-Jahresgehalt. Darüber darfst du zwischen GKV und PKV wählen. Studenten und Azubis sind grundsätzlich GKV-pflichtig (Familienversicherung bis 25 sogar kostenlos).',
        },
        {
          title: 'Krankenkasse wählen',
          description: 'Vergleiche Beitragssatz (Zusatzbeitrag) und Leistungen der gesetzlichen Kassen.',
          details: 'Alle gesetzlichen Kassen sind zur Grundversorgung verpflichtet und die Qualität ist ähnlich – Unterschiede gibt es im Zusatzbeitrag (z. B. 1,0 % vs. 2,3 %) und bei Bonusprogrammen. Der Wechsel ist nach 12 Monaten möglich.',
        },
        {
          title: 'Mitgliedsbescheinigung anfordern',
          description: 'Melde dich online bei der Kasse an und lade dir die Bescheinigung herunter.',
          details: 'Die Kasse braucht deine Sozialversicherungsnummer und deine Meldeadresse. Die Bescheinigung bekommt dein Arbeitgeber oder deine Hochschule – sie ist Voraussetzung für Arbeits- oder Studienbeginn.',
        },
        {
          title: 'Elektronische Gesundheitskarte aktivieren',
          description: 'Nach der Anmeldung kommt deine Gesundheitskarte per Post.',
          details: 'Heute läuft die „Krankenversicherungskarte“ elektronisch: Beim Arzt einfach vorlegen – alles Weitere passiert im Hintergrund (eAU, Rezepte, Überweisungen).',
        },
      ]}
      checklist={[
        { id: 'pflicht', label: 'Geklärt: Bin ich GKV-pflichtversichert oder PKV-berechtigt?' },
        { id: 'kasse', label: 'Krankenkasse ausgewählt (Zusatzbeitrag verglichen)' },
        { id: 'anmeldung', label: 'Online-Anmeldung bei der Krankenkasse abgeschlossen' },
        { id: 'bescheinigung', label: 'Mitgliedsbescheinigung an Arbeitgeber/Hochschule geschickt' },
      ]}
      tips={[
        'Der GKV-Zusatzbeitrag wird seit 2025 zur Hälfte vom Arbeitgeber übernommen – auf dein Nettoeinkommen wirkt aber der volle Prozentsatz.',
        'Familienversicherung: Ehepartner und Kinder bis 25 sind kostenlos mitversichert, wenn sie kein eigenes Einkommen über 535 €/Monat (2025) haben.',
        'Freiberufler/Selbstständige: Du bist nicht GKV-pflichtig, kannst aber die freiwillige GKV wählen – das ist oft günstiger als die PKV.',
        'Zahnarzt und Arzt-Termine: Bei akuten Beschwerden hilft der ärztliche Bereitschaftsdienst unter 116117.',
      ]}
    >
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">GKV vs. PKV auf einen Blick</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <h3 className="font-bold text-foreground mb-3">Gesetzliche Krankenversicherung (GKV)</h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• Beitrag: prozentual vom Bruttolohn (ca. 14,6 % + Zusatzbeitrag)</li>
              <li>• Mitversicherung von Familie ohne Aufpreis</li>
              <li>• Freie Arztwahl im GKV-System, Überweisungssystem</li>
              <li>• Rückerstattung von Kuren, Physiotherapie etc. (mit Budget)</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
            <h3 className="font-bold text-foreground mb-3">Private Krankenversicherung (PKV)</h3>
            <ul className="text-sm text-muted-foreground space-y-1.5">
              <li>• Beitrag: individuell (Alter, Gesundheit, Leistungen)</li>
              <li>• Keine Familienversicherung – jedes Mitglied zahlt separat</li>
              <li>• Schnellere Termine, private Arztwahl, Einzelzimmer</li>
              <li>• Nur für Gutverdiener (über Jahresarbeitsentgeltgrenze) und Selbstständige</li>
            </ul>
          </div>
        </div>

        <h3 className="font-semibold text-foreground mb-4">Große gesetzliche Kassen</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {(providers && providers.length > 0
            ? providers.map((p) => ({ name: p.name, url: p.website || 'https://www.gkv-spitzenverband.de' }))
            : fallbackKassen
          ).map((k) => (
            <a key={k.name} href={k.url} target="_blank" rel="noopener noreferrer" className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors flex items-center gap-3">
              <Heart className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground">{k.name}</p>
                <p className="text-sm text-primary hover:underline flex items-center gap-1">Webseite <ExternalLink className="w-3 h-3" /></p>
              </div>
            </a>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-6">
          Alle Angaben ohne Gewähr – Beitragssätze und Regeln ändern sich jährlich.
        </p>
      </Card>
    </ModuleShell>
  );
}
