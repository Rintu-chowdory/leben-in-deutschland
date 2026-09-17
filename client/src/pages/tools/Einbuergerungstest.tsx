import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, GraduationCap } from "lucide-react";
import { getQuizStat, saveQuizResult } from "@/lib/progress";

// Fragen im Stil des offiziellen Fragenkatalogs „Leben in Deutschland“ (Bund, allgemein).
// Der echte Test besteht aus 33 Fragen, davon müssen 17 richtig beantwortet werden.
interface Frage {
  frage: string;
  optionen: string[];
  antwort: number; // Index der richtigen Antwort
  erklaerung: string;
}

export const fragen: Frage[] = [
  { frage: 'Wie viele Bundesländer hat Deutschland?', optionen: ['14', '16', '18', '12'], antwort: 1, erklaerung: 'Deutschland besteht aus 16 Bundesländern.' },
  { frage: 'Wer wählt in Deutschland den Bundeskanzler?', optionen: ['Das Volk direkt', 'Der Bundestag', 'Der Bundespräsident', 'Der Bundesrat'], antwort: 1, erklaerung: 'Der Bundestag wählt den Bundeskanzler bzw. die Bundeskanzlerin.' },
  { frage: 'Wer ist das Staatsoberhaupt der Bundesrepublik Deutschland?', optionen: ['Der Bundeskanzler', 'Der Bundespräsident', 'Der Präsident des Bundestages', 'Der Bundesrat'], antwort: 1, erklaerung: 'Der Bundespräsident ist das Staatsoberhaupt und vertritt die Bundesrepublik völkerrechtlich.' },
  { frage: 'Wer ernennt in Deutschland die Bundesminister?', optionen: ['Der Bundestag', 'Der Bundesrat', 'Der Bundespräsident', 'Das Volk'], antwort: 2, erklaerung: 'Der Bundespräsident ernennt die Bundesminister auf Vorschlag des Bundeskanzlers.' },
  { frage: 'Wie heißen die gewählten Vertreter des Volkes im Deutschen Bundestag?', optionen: ['Botschafter', 'Delegierte', 'Abgeordnete', 'Minister'], antwort: 2, erklaerung: 'Die Mitglieder des Bundestages heißen Abgeordnete – sie werden vom Volk gewählt.' },
  { frage: 'Welche Farben hat die deutsche Bundesflagge?', optionen: ['Schwarz-Rot-Grün', 'Schwarz-Weiß-Rot', 'Rot-Gold-Weiß', 'Schwarz-Rot-Gold'], antwort: 3, erklaerung: 'Die Bundesflagge ist Schwarz-Rot-Gold.' },
  { frage: 'Welchen Feiertag feiern die Menschen in Deutschland am 3. Oktober?', optionen: ['Tag der Arbeit', 'Tag der Deutschen Einheit', 'Weltkindertag', 'Tag der Grundgesetzfeier'], antwort: 1, erklaerung: 'Der 3. Oktober ist der Tag der Deutschen Einheit – Nationalfeiertag der Wiedervereinigung 1990.' },
  { frage: 'In welchem Jahr wurde die Bundesrepublik Deutschland gegründet?', optionen: ['1945', '1949', '1953', '1990'], antwort: 1, erklaerung: 'Die Bundesrepublik Deutschland wurde 1949 gegründet.' },
  { frage: 'Wann fiel die Berliner Mauer?', optionen: ['1961', '1973', '1989', '1990'], antwort: 2, erklaerung: 'Die Berliner Mauer fiel am 9. November 1989.' },
  { frage: 'Wer war der erste Bundeskanzler der Bundesrepublik Deutschland?', optionen: ['Willy Brandt', 'Ludwig Erhard', 'Helmut Schmidt', 'Konrad Adenauer'], antwort: 3, erklaerung: 'Konrad Adenauer war von 1949 bis 1963 der erste Bundeskanzler.' },
  { frage: 'Welche Zeile stammt aus der deutschen Nationalhymne?', optionen: ['„Einigkeit und Recht und Freiheit“', '„Arbeit, Brot und Frieden“', '„Freiheit lebe unser Land“', '„Deutschland, Deutschland über alles“'], antwort: 0, erklaerung: 'Die dritte Strophe mit „Einigkeit und Recht und Freiheit“ ist die Nationalhymne.' },
  { frage: 'Wodurch wird die Macht des Staates in Deutschland begrenzt?', optionen: ['Durch die Presse', 'Durch die Gewaltenteilung', 'Durch das Militär', 'Durch die Kirchen'], antwort: 1, erklaerung: 'Gewaltenteilung (Legislative, Exekutive, Judikative) begrenzt die Staatsmacht.' },
  { frage: 'Welche Aussage zur Meinungsfreiheit ist in Deutschland richtig?', optionen: ['Nur deutsche Staatsbürger dürfen ihre Meinung sagen', 'Jeder Mensch darf seine Meinung frei äußern', 'Im Internet gilt keine Meinungsfreiheit', 'Kritik an der Regierung ist verboten'], antwort: 1, erklaerung: 'Die Meinungsfreiheit ist ein Grundrecht und gilt für jeden Menschen in Deutschland.' },
  { frage: 'Wer bezahlt in Deutschland die Beiträge zur Sozialversicherung?', optionen: ['Nur der Arbeitnehmer', 'Nur der Staat', 'Arbeitgeber und Arbeitnehmer je zur Hälfte', 'Die Krankenkasse allein'], antwort: 2, erklaerung: 'Sozialversicherungsbeiträge tragen Arbeitgeber und Arbeitnehmer grundsätzlich je zur Hälfte.' },
  { frage: 'Wofür steht die Abkürzung „BAföG“?', optionen: ['Bauförderung für Familien', 'Ausbildungsförderung für Schüler und Studierende', 'Bayerisches Amt für Güterverkehr', 'Beamten-Ausbildungsgesetz'], antwort: 1, erklaerung: 'BAföG = Bundesausbildungsförderungsgesetz – finanzielle Förderung für Schüler und Studierende.' },
  { frage: 'Wer darf in Deutschland bei Bundestagswahlen wählen?', optionen: ['Alle Einwohner ab 16 Jahren', 'Alle Deutschen ab 18 Jahren', 'Alle Europäer mit Wohnsitz in Deutschland', 'Alle Erwachsenen mit festem Job'], antwort: 1, erklaerung: 'Wahlberechtigt sind Deutsche ab 18 Jahren (seit 2025 auch ab 16).', },
  { frage: 'Welches Ereignis fand am 9. November 1938 statt?', optionen: ['Der Mauerbau in Berlin', 'Die Reichspogromnacht', 'Die Währungsreform', 'Die erste Bundestagswahl'], antwort: 1, erklaerung: 'Am 9. November 1938 begannen die Novemberpogrome gegen jüdische Menschen.' },
  { frage: 'Wer war Martin Luther?', optionen: ['Ein Maler', 'Ein Reformator', 'Ein Komponist', 'Ein Physiker'], antwort: 1, erklaerung: 'Martin Luther war der Reformator, der 1517 die Reformation auslöste.' },
  { frage: 'Wofür ist Johann Sebastian Bach bekannt?', optionen: ['Als Schriftsteller', 'Als Komponist', 'Als Fußballspieler', 'Als Politiker'], antwort: 1, erklaerung: 'Johann Sebastian Bach war einer der berühmtesten Komponisten Deutschlands.' },
  { frage: 'Wofür ist Albert Einstein bekannt?', optionen: ['Für die Relativitätstheorie', 'Für das Periodensystem', 'Für den Buchdruck', 'Für die Röntgenstrahlung'], antwort: 0, erklaerung: 'Albert Einstein entwickelte die Relativitätstheorie.' },
  { frage: 'Wer schrieb die „Ode an die Freude“?', optionen: ['Johann Wolfgang von Goethe', 'Friedrich Schiller', 'Heinrich Heine', 'Gotthold E. Lessing'], antwort: 1, erklaerung: 'Friedrich Schiller schrieb die „Ode an die Freude“ – vertont von Beethoven in der 9. Sinfonie.' },
  { frage: 'Welche Religion hat in Deutschland die meisten Mitglieder?', optionen: ['Der Islam', 'Das Christentum', 'Das Judentum', 'Der Buddhismus'], antwort: 1, erklaerung: 'Die Mehrheit der Menschen in Deutschland gehört einer christlichen Konfession an.' },
  { frage: 'In welchem Jahr begann der Zweite Weltkrieg?', optionen: ['1918', '1933', '1939', '1945'], antwort: 2, erklaerung: 'Der Zweite Weltkrieg begann am 1. September 1939 mit dem Angriff auf Polen.' },
  { frage: 'Wie viele Einwohner hat Deutschland ungefähr?', optionen: ['Etwa 40 Millionen', 'Etwa 64 Millionen', 'Über 80 Millionen', 'Über 120 Millionen'], antwort: 2, erklaerung: 'Deutschland hat rund 84 Millionen Einwohner.' },
  { frage: 'Wofür steht die Abkürzung „DRK“?', optionen: ['Deutscher Rundfunk-Kanal', 'Deutsches Rotes Kreuz', 'Deutsche Renten-Kasse', 'Direktorat für Raumfahrt und Klima'], antwort: 1, erklaerung: 'DRK = Deutsches Rotes Kreuz, die größte Hilfsorganisation Deutschlands.' },
  { frage: 'Was kann ein Tarifvertrag in Deutschland regeln?', optionen: ['Die Höhe des Lohns', 'Die Höhe der Kirchensteuer', 'Das Wahlrecht', 'Die Schulpflicht'], antwort: 0, erklaerung: 'Tarifverträge regeln z. B. Löhne, Arbeitszeiten und Urlaubsanspruch zwischen Gewerkschaft und Arbeitgeber.' },
  { frage: 'Wer entscheidet in Deutschland über Auslandseinsätze der Bundeswehr?', optionen: ['Der Bundespräsident', 'Der Verteidigungsminister allein', 'Der Bundestag', 'Das Bundesverfassungsgericht'], antwort: 2, erklaerung: 'Der Bundestag beschließt mit einfacher Mehrheit über Auslandseinsätze der Bundeswehr.' },
  { frage: 'Wo meldet man in Deutschland seinen Wohnsitz nach einem Umzug an?', optionen: ['Beim Bürgeramt / Einwohnermeldeamt', 'Bei der Polizei', 'Beim Finanzamt', 'Bei der Botschaft'], antwort: 0, erklaerung: 'Die Anmeldung erfolgt beim Bürgeramt (Einwohnermeldeamt) – innerhalb von 14 Tagen nach dem Einzug.' },
  { frage: 'Welche Strafe droht in Deutschland, wenn jemand ohne Führerschein Auto fährt?', optionen: ['Nur eine Verwarnung', 'Geldstrafe oder Freiheitsstrafe', 'Der Entzug des Reisepasses', 'Arbeitsdienst'], antwort: 1, erklaerung: 'Fahren ohne Führerschein ist eine Straftat und kann Geld- oder Freiheitsstrafe zur Folge haben.' },
  { frage: 'Wie hieß der deutsche Staat, der von 1949 bis 1990 im Osten Deutschlands bestand?', optionen: ['Die Weimarer Republik', 'Die Deutsche Demokratische Republik (DDR)', 'Der Deutsche Bund', 'Die Norddeutsche Union'], antwort: 1, erklaerung: 'Die DDR bestand von 1949 bis zur Wiedervereinigung 1990.' },
];

type Phase = 'start' | 'running' | 'done';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Einbuergerungstest() {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<Phase>('start');
  const [anzahl, setAnzahl] = useState(30);
  const [index, setIndex] = useState(0);
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  const [punkte, setPunkte] = useState(0);
  const [verlauf, setVerlauf] = useState<boolean[]>([]);
  const quiz = getQuizStat();

  const fragenSatz = useMemo(
    () => (phase === 'start' ? [] : shuffle(fragen).slice(0, anzahl)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, anzahl]
  );

  const aktuelle = fragenSatz[index];

  const start = (n: number) => {
    setAnzahl(n);
    setIndex(0);
    setPunkte(0);
    setVerlauf([]);
    setGewaehlt(null);
    setPhase('running');
  };

  const waehlen = (i: number) => {
    if (gewaehlt !== null) return;
    setGewaehlt(i);
    const richtig = i === aktuelle.antwort;
    if (richtig) setPunkte((p) => p + 1);
    setVerlauf((v) => [...v, richtig]);
  };

  const weiter = () => {
    if (index + 1 >= fragenSatz.length) {
      setPhase('done');
      saveQuizResult((punkte / fragenSatz.length) * 100);
    } else {
      setIndex((i) => i + 1);
      setGewaehlt(null);
    }
  };

  const prozent = fragenSatz.length ? Math.round((punkte / fragenSatz.length) * 100) : 0;
  const bestanden = fragenSatz.length > 0 && punkte >= Math.ceil(fragenSatz.length * 0.6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zum Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-primary" /> Einbürgerungstest-Trainer
          </h1>
          <p className="text-muted-foreground">
            30 Fragen im Stil des offiziellen Katalogs „Leben in Deutschland“ – bestehenswert: ab 60%
          </p>
        </div>
      </header>

      <main className="container py-10 max-w-3xl">
        {phase === 'start' && (
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Bereit für die Prüfung?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Der echte Einbürgerungstest umfasst 33 Fragen, von denen du 17 richtig beantworten musst.
              Übe hier im Schnellmodus oder mit dem kompletten Katalog.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              <button className="rounded-xl border-2 border-border p-6 hover:border-primary hover:shadow-lg transition-all" onClick={() => start(10)}>
                <span className="text-2xl font-bold text-foreground block mb-1">Schnell-Quiz</span>
                <span className="text-sm text-muted-foreground">10 zufällige Fragen</span>
              </button>
              <button className="rounded-xl border-2 border-border p-6 hover:border-primary hover:shadow-lg transition-all" onClick={() => start(30)}>
                <span className="text-2xl font-bold text-foreground block mb-1">Volle Prüfung</span>
                <span className="text-sm text-muted-foreground">Alle 30 Fragen</span>
              </button>
            </div>
            {quiz.attempts > 0 && (
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-amber-500" /> Bestwert: <b className="text-foreground">{quiz.bestScore}%</b></span>
                <span>Versuche: <b className="text-foreground">{quiz.attempts}</b></span>
              </div>
            )}
          </Card>
        )}

        {phase === 'running' && aktuelle && (
          <div className="space-y-6">
            {/* Fortschritt */}
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Frage {index + 1} von {fragenSatz.length}</span>
                <span>{punkte} richtig</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500" style={{ width: `${((index + 1) / fragenSatz.length) * 100}%` }} />
              </div>
              <div className="flex gap-1 mt-2">
                {verlauf.map((ok, i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full ${ok ? 'bg-green-500' : 'bg-red-400'}`} />
                ))}
              </div>
            </div>

            <Card className="p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">{aktuelle.frage}</h2>
              <div className="space-y-3">
                {aktuelle.optionen.map((opt, i) => {
                  let klasse = 'border-border hover:border-primary/60 hover:bg-muted/50';
                  if (gewaehlt !== null) {
                    if (i === aktuelle.antwort) klasse = 'border-green-500 bg-green-50 dark:bg-green-950/30';
                    else if (i === gewaehlt) klasse = 'border-red-400 bg-red-50 dark:bg-red-950/30';
                    else klasse = 'border-border opacity-60';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => waehlen(i)}
                      disabled={gewaehlt !== null}
                      className={`w-full text-left rounded-xl border-2 p-4 transition-all flex items-center gap-3 ${klasse}`}
                    >
                      <span className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-foreground">{opt}</span>
                      {gewaehlt !== null && i === aktuelle.antwort && <CheckCircle2 className="w-5 h-5 text-green-600 ml-auto" />}
                      {gewaehlt !== null && i === gewaehlt && i !== aktuelle.antwort && <XCircle className="w-5 h-5 text-red-500 ml-auto" />}
                    </button>
                  );
                })}
              </div>

              {gewaehlt !== null && (
                <div className="mt-6 p-4 rounded-lg bg-muted/60 border border-border">
                  <p className="text-sm text-foreground">{aktuelle.erklaerung}</p>
                </div>
              )}

              {gewaehlt !== null && (
                <Button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={weiter}>
                  {index + 1 >= fragenSatz.length ? 'Ergebnis ansehen' : 'Nächste Frage'}
                </Button>
              )}
            </Card>
          </div>
        )}

        {phase === 'done' && (
          <Card className="p-10 text-center">
            <div className="text-6xl mb-4">{bestanden ? '🎉' : '📚'}</div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {bestanden ? 'Bestanden!' : 'Weiter üben!'}
            </h2>
            <p className="text-muted-foreground mb-1">
              Du hast <b className="text-foreground">{punkte}</b> von {fragenSatz.length} Fragen richtig beantwortet.
            </p>
            <p className="text-2xl font-bold text-primary mb-8">{prozent}%</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" onClick={() => start(anzahl)}>
                <RotateCcw className="w-4 h-4 mr-2" /> Nochmal spielen
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Zum Dashboard</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-8 max-w-md mx-auto">
              Hinweis: Dieser Trainer orientiert sich am offiziellen Fragenkatalog, stellt aber keine vollständige
              oder rechtsverbindliche Prüfungssimulation dar. Die echte Prüfung umfasst 33 Fragen inkl. Landesfragen.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
}
