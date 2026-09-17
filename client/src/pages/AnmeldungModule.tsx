import ModuleShell from "@/components/ModuleShell";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Loader2, ExternalLink } from "lucide-react";

export default function AnmeldungModule() {
  const { isAuthenticated } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>('');

  const { data: cities, isLoading: citiesLoading } = trpc.anmeldung.getCities.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: offices, isLoading: officesLoading } = trpc.anmeldung.getOffices.useQuery(
    { city: selectedCity || undefined },
    { enabled: isAuthenticated && !!selectedCity }
  );

  const hasOfficeData = !!(offices && offices.length > 0);

  return (
    <ModuleShell
      id="anmeldung"
      title="Anmeldung – Wohnsitz anmelden"
      subtitle="Dein erster behördlicher Pflichttermin nach dem Einzug"
      introTitle="Was ist die Anmeldung?"
      intro={[
        'Die Anmeldung (auch „Wohnsitzanmeldung“ oder „Polizeiliche Anmeldung“) ist die offizielle Registrierung deines Wohnsitzes beim Bürgeramt (Einwohnermeldeamt). Sie ist in Deutschland gesetzlich vorgeschrieben – und zwar innerhalb von 14 Tagen nach dem Einzug.',
        'Ohne Anmeldung bekommst du keine Steuer-ID, kannst kaum ein Bankkonto eröffnen und dich nicht bei Ärzten, Versicherungen oder Behörden eintragen. Kurz: Sie ist der Schlüssel zum gesamten Leben in Deutschland.',
      ]}
      steps={[
        {
          title: 'Wohnungsgeberbestätigung besorgen',
          description: 'Dein Vermieter muss dir eine Wohnungsgeberbestätigung ausstellen – ohne sie ist die Anmeldung unmöglich.',
          details: 'Das Formular ist Pflicht seit 2016. Viele Vermieter haben es vorbereitet; es muss Name, Anschrift und Datum des Einzugs enthalten. Bei Wohnen in Wohnheimen oder bei Wohnungsgeber-Unterfirmen gelten Sonderregeln.',
        },
        {
          title: 'Termin beim Bürgeramt buchen',
          description: 'Suche das Bürgeramt deiner Stadt und buche frühzeitig einen Termin – in Großstädten können es mehrere Wochen sein.',
          details: 'Viele Städte bieten Online-Terminvergabe. Alternativ: anrufen oder direkt vor Ort eine Wartenummer ziehen. Der Termin selbst dauert meist nur 15–30 Minuten.',
        },
        {
          title: 'Unterlagen zusammenstellen',
          description: 'Reisepass/Personalausweis, Wohnungsgeberbestätigung und ggf. Anmeldeformular mitbringen.',
          details: 'Ausländische Dokumente müssen teils übersetzt oder beglaubigt sein. Eine Checkliste findest du weiter oben – hake ab, was du schon hast.',
        },
        {
          title: 'Anmeldung durchführen',
          description: 'Vor Ort bekommst du deine Meldebescheinigung – sofort und direkt.',
          details: 'Die Meldebescheinigung ist wichtig für Bank, Versicherung, Ausländerbehörde und Arbeitgeber. Hebe sie gut auf bzw. speichere sie digital.',
        },
      ]}
      checklist={[
        { id: 'passport', label: 'Reisepass oder Personalausweis (im Original)' },
        { id: 'wugeber', label: 'Wohnungsgeberbestätigung vom Vermieter (Pflicht!)' },
        { id: 'mietvertrag', label: 'Mietvertrag (falls vorhanden, zur Sicherheit)' },
        { id: 'formular', label: 'Anmeldeformular ausgefüllt (vorab online möglich)' },
        { id: 'termin', label: 'Termin beim Bürgeramt gebucht' },
      ]}
      tips={[
        'Die 14-Tage-Frist gilt ab Einzugsdatum – buche den Termin also direkt mit dem Einzug.',
        'Bei versäumter Frist droht ein Bußgeld (meist bis zu 1.000 €, oft wird es bei kurzem Verzug nicht verfolgt).',
        'In Berlin: Termine über service.berlin.de sind begehrt – probiere es früh morgens oder nutze die Termin-Warteschlange.',
        'Beantrage direkt beim Termin eine Steuer-ID (falls noch nicht vorhanden) und eine Bescheinigung für deine Krankenkasse.',
      ]}
    >
      {/* Behördenfinder */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Meldebehörde finden</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {isAuthenticated
            ? 'Wähle deine Stadt und finde das zuständige Bürgeramt.'
            : 'Im Gast-Modus zeigen wir dir die offiziellen Portale der größten Städte.'}
        </p>

        {isAuthenticated && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">Stadt auswählen</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Stadt wählen…" />
              </SelectTrigger>
              <SelectContent>
                {citiesLoading ? (
                  <div className="p-2 text-center text-muted-foreground">Städte werden geladen…</div>
                ) : (
                  cities?.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {isAuthenticated && selectedCity && (
          <div className="space-y-4 mb-6">
            {officesLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : hasOfficeData ? (
              offices!.map((office) => (
                <div key={office.id} className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{office.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{office.address}</p>
                      {office.phone && <p className="text-sm text-muted-foreground">📞 {office.phone}</p>}
                      {office.website && (
                        <a href={office.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
                          Webseite besuchen →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">Für diese Stadt liegen aktuell keine Ämter vor – nutze die offiziellen Portale unten.</p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'service.berlin.de', desc: 'Bürgeramt-Termine in Berlin', url: 'https://service.berlin.de' },
            { name: 'Hamburg – Service-Portal', desc: 'Anmeldung in Hamburg', url: 'https://www.hamburg.de/onlinedienste/' },
            { name: 'München – Rathaus', desc: 'Bürgerbüro-Termine in München', url: 'https://www.muenchen.de/rathaus' },
            { name: 'Bürgerdienste (11880 / Stadtportale)', desc: 'Fast alle Städte bieten Online-Terminvergabe', url: 'https://www.serviceportal.de' },
          ].map((l) => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors">
              <p className="font-semibold text-foreground flex items-center gap-2">{l.name} <ExternalLink className="w-3.5 h-3.5" /></p>
              <p className="text-sm text-muted-foreground mt-1">{l.desc}</p>
            </a>
          ))}
        </div>
      </Card>
    </ModuleShell>
  );
}
