import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useMemo, useState } from "react";
import { ArrowLeft, ScanText, Sparkles, Wand2 } from "lucide-react";

// Amtsdeutsch-Dekodierer: füge einen Behördenbrief ein – das Tool
// markiert typische Verwaltungsformulierungen und erklärt sie in normalem Deutsch.

interface Eintrag {
  term: string;
  normal: string;
  hinweis?: string;
}

const glossar: Eintrag[] = [
  { term: 'hiermit', normal: 'mit diesem Schreiben', hinweis: 'Füllwort – kann man immer ignorieren.' },
  { term: 'teile ich Ihnen mit', normal: 'Ich sage Ihnen:' },
  { term: 'wird hiermit', normal: 'mit diesem Brief', hinweis: 'Füllwort.' },
  { term: 'zur Kenntnis bringen', normal: 'Sie sollen das wissen / gelesen haben' },
  { term: 'wird darauf hingewiesen', normal: 'Wichtig zu wissen:' },
  { term: 'es wird darauf hingewiesen', normal: 'Wichtig zu wissen:' },
  { term: 'Ich bitte Sie', normal: 'Bitte tun Sie Folgendes' },
  { term: 'gebeten', normal: 'gebeten = Sie sollen', hinweis: 'Höfliche Form eines Befehls.' },
  { term: 'fristgerecht', normal: 'rechtzeitig, bevor die Frist abläuft' },
  { term: 'fristwahrend', normal: 'rechtzeitig abgeschickt (Datum des Poststempels zählt)' },
  { term: 'fristlos', normal: 'sofort, ohne Kündigungsfrist' },
  { term: 'gemäß', normal: 'nach / laut (einer Regel)' },
  { term: 'gem. §', normal: 'laut Paragraf (Gesetz), z. B. gemäß § 17 BMG = Regel 17 im Bundesmeldegesetz' },
  { term: 'in Verbindung mit', normal: 'zusammen mit' },
  { term: 'bezüglich', normal: 'zu / über' },
  { term: 'betreffend', normal: 'zu diesem Thema' },
  { term: 'der Höhe nach', normal: 'was den Betrag angeht' },
  { term: 'nicht unerheblich', normal: 'recht viel / wichtig' },
  { term: 'nachfragen', normal: 'Nochmal fragen' },
  { term: 'in Anlage', normal: 'im beigelegten Blatt / als Anhang' },
  { term: 'anbei', normal: 'liegt bei / ist angehängt' },
  { term: 'beiliegend', normal: 'im Briefumschlag dabei' },
  { term: 'beigefügt', normal: 'im Briefumschlag dabei' },
  { term: 'eingehend', normal: 'sehr genau' },
  { term: 'umgehend', normal: 'sofort, schnell' },
  { term: 'unverzüglich', normal: 'sofort, ohne schuldhaftes Zögern', hinweis: 'Eine kleine, kurze Verzögerung ist okay.' },
  { term: 'voraussichtlich', normal: 'wahrscheinlich' },
  { term: 'vorausschauend', normal: 'früh an etwas denken' },
  { term: 'weitgehend', normal: 'größtenteils' },
  { term: 'im Wesentlichen', normal: 'fast alles, kleine Details fehlen' },
  { term: 'z. Zt.', normal: 'zurzeit, gerade jetzt' },
  { term: 'u. a.', normal: 'unter anderem' },
  { term: 'ggf.', normal: 'falls nötig / wenn es sein muss' },
  { term: 'evtl.', normal: 'vielleicht' },
  { term: 'i. S. d.', normal: 'im Sinne des (Gesetzes)' },
  { term: 'Einspruch', normal: 'Widerspruch gegen eine Entscheidung', hinweis: 'Verbraucher-Steuern: Einspruch, Verwaltung: Widerspruch.' },
  { term: 'Widerspruch', normal: 'schriftlich widersprechen – die Entscheidung ist dann noch nicht endgültig' },
  { term: 'Widerspruchsfrist', normal: 'Zeitfenster zum Widersprechen (meist 1 Monat nach Zustellung)' },
  { term: 'Verwaltungsakt', normal: 'eine verbindliche Entscheidung der Behörde' },
  { term: 'Bescheid', normal: 'offizielle, verbindliche Antwort der Behörde' },
  { term: 'bestandskräftig', normal: 'endgültig – Widerspruchsfrist ist abgelaufen' },
  { term: 'rechtskräftig', normal: 'endgültig entschieden' },
  { term: 'Zustellung', normal: 'offizielle Übergabe, ab der Fristen laufen' },
  { term: 'zuständige Behörde', normal: 'das Amt, das für dein Thema verantwortlich ist' },
  { term: 'Zuständigkeit', normal: 'welches Amt zuständig ist' },
  { term: 'Anhörung', normal: 'Möglichkeit, deinen Standpunkt zu sagen, bevor entschieden wird' },
  { term: 'gebührenpflichtig', normal: 'das kostet Geld (Gebühr)' },
  { term: 'kostenpflichtig', normal: 'das kostet Geld' },
  { term: 'kostet 0 Euro', normal: 'kostenfrei', hinweis: 'Sehr gut!' },
  { term: 'Genehmigungsfiktion', normal: 'Wenn die Behörde nicht rechtzeitig antwortet, gilt die Genehmigung als erteilt' },
  { term: 'Anzeige', normal: 'meldung bei der Behörde, meist Pflicht' },
  { term: 'Antrag stellen', normal: 'formal beantragen (oft mit Formular)' },
  { term: 'Antragsunterlagen', normal: 'Dokumente, die du mitschicken musst' },
  { term: 'benötigt', normal: 'gebraucht / nötig' },
  { term: 'Erfordernis', normal: 'Notwendigkeit' },
  { term: 'erforderlich', normal: 'nötig, Pflicht' },
  { term: 'Vorbehalt', normal: 'Ausnahme – es gilt nicht ganz so wie geschrieben' },
  { term: 'bis auf Widerruf', normal: 'gilt so lange, bis es offiziell zurückgenommen wird' },
  { term: 'außer Kraft', normal: 'ungültig, gilt nicht mehr' },
  { term: 'in Kraft treten', normal: 'gültig werden, anfangen zu gelten' },
  { term: 'nachweislich', normal: 'mit einem Dokument belegt' },
  { term: 'Verpflichtung', normal: 'Pflicht, etwas zu tun' },
  { term: 'erforderlichenfalls', normal: 'falls nötig' },
  { term: 'Zweitschrift', normal: 'Kopie für dich' },
  { term: 'Eingangsbestätigung', normal: 'Bestätigung, dass dein Brief angekommen ist' },
  { term: 'vermerkt', normal: 'notiert' },
  { term: 'erkennen', normal: 'offiziell anerkennen' },
  { term: 'dient der Nachweisführung', normal: 'zeigt offiziell, dass etwas stimmt' },
  { term: 'die Voraussetzungen liegen vor', normal: 'du erfüllst die Bedingungen – gut für dich' },
  { term: 'liegen nicht vor', normal: 'du erfüllst eine Bedingung nicht – das ist das Problem', hinweis: 'Oft steht dabei, was fehlt.' },
  { term: 'ordnungsgemäß', normal: 'richtig und vollständig ausgefüllt' },
  { term: 'vollständig', normal: 'alles ist dabei' },
  { term: 'abzugeben', normal: 'abgeben / einreichen' },
  { term: 'vorzulegen', normal: 'mitbringen oder mitschicken' },
  { term: 'beizubringen', normal: 'nachreichen / mitschicken' },
];

function escRe(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

export default function Amtsdeutsch() {
  const [, navigate] = useLocation();
  const [text, setText] = useState('');
  const [gewaehlt, setGewaehlt] = useState<Eintrag | null>(null);

  const analysiert = useMemo(() => {
    if (!text.trim()) return null;
    // Treffer sammeln (Wortgrenzen bei Begriffen mit Buchstaben)
    const treffer: Eintrag[] = [];
    for (const e of glossar) {
      const pattern = /[A-Za-zÄÖÜäöß]/.test(e.term[0])
        ? new RegExp(`\\b${escRe(e.term)}\\b`, 'i')
        : new RegExp(escRe(e.term), 'i');
      if (pattern.test(text)) treffer.push(e);
    }
    // Text in Segmente zerlegen: markierte Begriffe hervorheben
    const sorted = [...treffer].sort((a, b) => b.term.length - a.term.length);
    let rest = text;
    const segmente: { text: string; eintrag?: Eintrag }[] = [];
    let schutz = 0;
    while (rest && schutz < 500) {
      schutz++;
      let bestIdx = -1, bestEintrag: Eintrag | undefined, bestLen = 0;
      for (const e of sorted) {
        const pattern = /[A-Za-zÄÖÜäöß]/.test(e.term[0])
          ? new RegExp(`\\b${escRe(e.term)}`, 'i')
          : new RegExp(escRe(e.term), 'i');
        const m = pattern.exec(rest);
        if (m && (bestIdx === -1 || m.index < bestIdx || (m.index === bestIdx && m[0].length > bestLen))) {
          bestIdx = m.index; bestEintrag = e; bestLen = m[0].length;
        }
      }
      if (bestIdx === -1) { segmente.push({ text: rest }); break; }
      if (bestIdx > 0) segmente.push({ text: rest.slice(0, bestIdx) });
      segmente.push({ text: rest.slice(bestIdx, bestIdx + bestLen), eintrag: bestEintrag });
      rest = rest.slice(bestIdx + bestLen);
    }
    return { treffer, segmente };
  }, [text]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zum Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <ScanText className="w-8 h-8 text-primary" /> Amtsdeutsch-Dekodierer
          </h1>
          <p className="text-muted-foreground">Behördenbrief einfügen – klicken auf die markierten Wörter zeigt die Übersetzung</p>
        </div>
      </header>

      <main className="container py-10 max-w-3xl space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Dein Brief</h2>
            {text && (
              <Button
                size="sm" variant="ghost"
                onClick={() => { setText(''); setGewaehlt(null); }}
              >
                Leeren
              </Button>
            )}
          </div>
          {!text ? (
            <textarea
              className="w-full h-48 p-4 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Hier den Text deines Behördenbriefs einfügen … z. B. ein Schreiben vom Bürgeramt, der Krankenkasse oder dem Finanzamt."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          ) : (
            <div
              className="w-full min-h-48 max-h-[24rem] overflow-y-auto p-4 rounded-lg border border-input bg-background text-sm leading-relaxed whitespace-pre-wrap text-foreground"
            >
              {analysiert?.segmente.map((seg, i) =>
                seg.eintrag ? (
                  <button
                    key={i}
                    className="rounded bg-amber-100 dark:bg-amber-900/50 px-0.5 font-medium text-foreground hover:bg-amber-200 dark:hover:bg-amber-800 underline decoration-dotted underline-offset-2"
                    onClick={() => setGewaehlt(seg.eintrag!)}
                  >
                    {seg.text}
                  </button>
                ) : (
                  <span key={i}>{seg.text}</span>
                )
              )}
            </div>
          )}
          {text && (
            <p className="text-xs text-muted-foreground mt-3">
              {analysiert?.treffer.length
                ? `${analysiert.treffer.length} typische Amtsdeutsch-Begriffe gefunden.`
                : 'Keine bekannten Amtsdeutsch-Begriffe gefunden – vielleicht ein normaler Brief? 🙂'}
            </p>
          )}
        </Card>

        {gewaehlt && (
          <Card className="p-6 border-primary/40">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground">„{gewaehlt.term}“ heißt:</p>
                <p className="text-foreground/90 mt-1">{gewaehlt.normal}</p>
                {gewaehlt.hinweis && (
                  <p className="text-sm text-muted-foreground mt-2">{gewaehlt.hinweis}</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {analysiert && analysiert.treffer.length > 0 && (
          <Card className="p-6">
            <h2 className="font-semibold text-foreground mb-4">Alle gefundenen Begriffe</h2>
            <div className="flex flex-wrap gap-2">
              {analysiert.treffer.map((e) => (
                <button
                  key={e.term}
                  onClick={() => setGewaehlt(e)}
                  className="px-3 py-1.5 rounded-full border border-border bg-muted hover:bg-accent text-sm text-foreground transition-colors"
                >
                  {e.term}
                </button>
              ))}
            </div>
          </Card>
        )}

        {!text && (
          <Card className="p-6 bg-muted/50">
            <h2 className="font-semibold text-foreground mb-2">So funktioniert's</h2>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Öffne den Brief vom Amt, der Krankenkasse, dem Finanzamt usw.</li>
              <li>Kopiere den Text und füge ihn hier ein.</li>
              <li>Klicke auf die gelb markierten Wörter – du bekommst eine Übersetzung in normalem Deutsch.</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-4">
              Alles läuft nur in deinem Browser. Der Text wird nicht gespeichert oder gesendet.
            </p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setText(
                'Sehr geehrte/r Frau/Herr Müller,\n\nhiermit teile ich Ihnen mit, dass Ihr Antrag fristgerecht eingegangen ist. Es wird darauf hingewiesen, dass die Unterlagen ordnungsgemäß vorzulegen sind. Über den Bescheid werden Sie unverzüglich in Kenntnis gesetzt.'
              )}>
                <Wand2 className="w-4 h-4 mr-2" /> Beispiel ausprobieren
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
