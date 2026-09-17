import ModuleShell from "@/components/ModuleShell";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, GraduationCap, Loader2, MapPin } from "lucide-react";

export default function IntegrationCoursesModule() {
  const { isAuthenticated } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>('');

  const { data: cities, isLoading: citiesLoading } = trpc.integrationCourses.getCities.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: courses, isLoading: coursesLoading } = trpc.integrationCourses.getCourses.useQuery(
    { city: selectedCity || undefined },
    { enabled: isAuthenticated && !!selectedCity }
  );

  return (
    <ModuleShell
      id="integration"
      title="Integrationskurse"
      subtitle="Deutsch lernen – vom Alphabetisierungskurs bis zur B1-Prüfung"
      introTitle="Was ist ein Integrationskurs?"
      intro={[
        'Ein Integrationskurs ist ein staatlich geförderter Sprach- und Orientierungskurs des BAMF (Bundesamt für Migration und Flüchtlinge): 600 bis 900 Stunden Deutsch plus einen Orientierungskurs zu Rechtsstaat, Geschichte und Kultur Deutschlands.',
        'Wenn du „berechtigt“ bist (Bescheid der Ausländerbehörde oder der Migrationsberatung), kostet dich der Kurs nur 1–2 € pro Stunde. Ohne Berechtigung ist die Teilnahme als „Selbstzahler“ meist teurer.',
        'Der Kurs endet mit dem Examen „Deutsch-Test für Zuwanderer“ (DTZ, B1). Mit dem Zertifikat erfüllst du eine wichtige Voraussetzung für die Einbürgerung.',
      ]}
      steps={[
        {
          title: 'Berechtigung prüfen',
          description: 'Bescheid der Ausländerbehörde (§ 44a AufenthG) oder Beratung durch die Migrationsberatungsstelle (MBE).',
          details: 'Ohne Bescheid: Die Migrationsberatung für erwachsene Zuwanderer hilft dir kostenlos weiter (Caritas, Diakonie, AWO, DRK etc. – siehe BAMF-Nav).',
        },
        {
          title: 'Kurs und Träger finden',
          description: 'Suche über die Kursnet-Datenbank der Bundesagentur für Arbeit oder über BAMF-NAv.',
          details: 'Kurse gibt es als Vollzeit (morgens), Teilzeit (abends) oder Intensiv. Sprachniveau und Wartezeiten variieren – oft startet der nächste Kurs innerhalb von 4–8 Wochen.',
        },
        {
          title: 'Anmeldung beim Träger',
          description: 'Mit dem Berechtigungsbescheid und deinem Pass meldest du dich direkt beim Kursträger an.',
          details: 'Der Träger übernimmt die Anmeldung beim BAMF und bestätigt dir den Kursbeginn. Bring den Bescheid mit – ohne ihn wird die Förderung nicht freigegeben.',
        },
        {
          title: 'Kurs besuchen und Prüfung ablegen',
          description: 'Nach dem Sprachkurs folgt der Orientierungskurs und dann das DTZ-B1-Examen.',
          details: 'Du darfst maximal 30 % der Stunden versäumen. Bei Bestehen der B1-Prüfung und dem Orientierungskurs-Zertifikat bekommst du das für die Einbürgerung nötige Bundle.',
        },
      ]}
      checklist={[
        { id: 'bescheid', label: 'Berechtigungsbescheid (Ausländerbehörde oder MBE) vorhanden' },
        { id: 'beratung', label: 'Migrationsberatung kontaktiert (falls kein Bescheid)' },
        { id: 'kursträger', label: 'Passender Kursträger und Starttermin gefunden' },
        { id: 'anmeldung', label: 'Anmeldung beim Träger abgeschlossen' },
      ]}
      tips={[
        'Die Kursnet-Suche der Bundesagentur für Arbeit zeigt alle staatlich geförderten Deutschkurse in deiner Nähe – mit Kosten und Startterminen.',
        'Ohne Berechtigung: Für Arbeitsuchende und Geflüchtete gibt es zusätzlich berufsbezogene Sprachkurse (DeuFöV) – ebenfalls BAMF-gefördert.',
        'Das Zertifikat B1 ist Voraussetzung für die Einbürgerung – der Einbürgerungstest-Trainer hier im Dashboard hilft dir bei der Prüfung.',
        'Integrationskurse sind kein Ersatz für Anerkennungsverfahren – für Hochschulzugang brauchst du ggf. TestDaF oder DSH.',
      ]}
    >
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Kurse in deiner Stadt finden</h2>
        <p className="text-sm text-muted-foreground mb-6">
          {isAuthenticated
            ? 'Wähle deine Stadt und finde aktuelle Kurse mit Startterminen.'
            : 'Im Gast-Modus verlinken wir dir die offiziellen Suchportale.'}
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
            {coursesLoading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : courses && courses.length > 0 ? (
              courses.map((c) => (
                <div key={c.id} className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{c.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {c.provider} · {c.courseType}
                        {c.startDate && ` · Start: ${new Date(c.startDate).toLocaleDateString('de-DE')}`}
                      </p>
                      {c.duration && <p className="text-xs text-muted-foreground">Dauer: {c.duration}</p>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">Keine Kurse gefunden – nutze die offiziellen Portale unten.</p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'Kursnet (Bundesagentur für Arbeit)', desc: 'Alle geförderten Integrations- und Berufssprachkurse', url: 'https://www.arbeitsagentur.de/kurse-und-lehrgaenge' },
            { name: 'BAMF-NAv', desc: 'Offizielle Kurssuche des Bundesamts für Migration und Flüchtlinge', url: 'https://www.bamf.de/DE/Themen/Integration/ZuwandererIntegrationskurse/Integrationskurse/integrationskurse-node.html' },
            { name: 'Migrationsberatung (MBE)', desc: 'Kostenlose Beratung – Caritas, Diakonie, AWO, DRK', url: 'https://www.bamf.de/DE/Themen/MigrationIntegration/Migrationsberatung/migrationsberatung-node.html' },
            { name: 'Deutsch-Test für Zuwanderer (DTZ)', desc: 'Infos zur B1-Abschlussprüfung (Goethe/telc)', url: 'https://www.bamf.de/DE/Themen/Integration/ZuwandererIntegrationskurse/Abschlusspruefung/abschlusspruefung-node.html' },
          ].map((l) => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" /> {l.name} <ExternalLink className="w-3.5 h-3.5" />
              </p>
              <p className="text-sm text-muted-foreground mt-1">{l.desc}</p>
            </a>
          ))}
        </div>
      </Card>
    </ModuleShell>
  );
}
