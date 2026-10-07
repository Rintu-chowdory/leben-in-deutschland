import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useState } from "react";
import { ArrowLeft, Wallet, Info } from "lucide-react";

// Vereinfachte Lohnsteuer-Schätzung nach § 32a EStG (Steuerjahr 2025/26).
// KEINE exakte Lohnsteuerberechnung – nur eine Orientierung.

const BBG_RV_AV_MONAT = 8050;   // Beitragsbemessungsgrenze Rente/Arbeitslosigkeit 2025
const BBG_KV_PV_MONAT = 5512.5; // Beitragsbemessungsgrenze Kranken/Pflege 2025
const KV_ZUSATZ_HALB = 0.0125;  // durchschn. Zusatzbeitrag 2,5 % → Arbeitnehmerhälfte

function tarifESt(zve: number): number {
  if (zve <= 12096) return 0;
  if (zve <= 17443) {
    const z = (zve - 12096) / 10000;
    return (932.3 * z + 1400) * z;
  }
  if (zve <= 68480) {
    const z = (zve - 17443) / 10000;
    return (176.64 * z + 2395) * z + 1015.13;
  }
  if (zve <= 277825) return 0.42 * zve - 10926.31;
  return 0.45 * zve - 19261.06;
}

function euro(n: number) {
  return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

export default function Gehaltsrechner() {
  const [, navigate] = useLocation();
  const [brutto, setBrutto] = useState('3000');
  const [steuerklasse, setSteuerklasse] = useState('1');
  const [kirche, setKirche] = useState('nein');
  const [kind, setKind] = useState(true);
  const [kirchenSatz, setKirchenSatz] = useState('9');

  const result = (() => {
    const g = Math.max(0, parseFloat(brutto) || 0);

    // Sozialversicherung (Arbeitnehmeranteile)
    const rv = 0.093 * Math.min(g, BBG_RV_AV_MONAT);
    const av = 0.013 * Math.min(g, BBG_RV_AV_MONAT);
    const kvBasis = Math.min(g, BBG_KV_PV_MONAT);
    const kv = 0.073 * kvBasis + KV_ZUSATZ_HALB * kvBasis;
    const pvSatz = kind ? 0.017 : 0.017 + 0.006; // Kinderlose zahlen Zuschlag
    const pv = pvSatz * kvBasis;
    const sv = rv + av + kv + pv;

    // Steuerbare Größen (vereinfacht)
    const jahrBrutto = g * 12;
    const werbungskosten = 1230; // Pauschale
    const sonderausgaben = 36;   // Pauschale
    const zveRoh = jahrBrutto - werbungskosten - sonderausgaben - (rv + av) * 12;
    const kinderfreibetrag = !kind ? 0 : 0; // über Lohnsteuerabzug nur pauschal berücksichtigt
    const zve = Math.max(0, zveRoh - kinderfreibetrag);

    let estJahr: number;
    if (steuerklasse === '3') {
      estJahr = 2 * tarifESt(zve / 2); // Splittingverfahren (vereinfacht)
    } else if (steuerklasse === '2') {
      estJahr = tarifESt(zve - 2604); // Entlastungsbetrag Alleinerziehende (grob)
    } else {
      estJahr = tarifESt(zve); // Klasse 1, 4
    }

    // Solidaritätszuschlag (Freigrenze 18.800 €, Milderungszone 11,9 %)
    const freigrenze = 18800;
    let soli = 0;
    if (estJahr > freigrenze) {
      soli = Math.min(0.055 * estJahr, 0.119 * (estJahr - freigrenze));
    }
    // Kirchensteuer
    const kirchensteuer = kirche !== 'nein' ? estJahr * (parseFloat(kirchenSatz) / 100) : 0;

    const steuerJahr = estJahr + soli + kirchensteuer;
    const lohnsteuerMonat = Math.max(0, steuerJahr / 12);

    return {
      rv, av, kv, pv, sv, lohnsteuerMonat,
      netto: Math.max(0, g - sv - lohnsteuerMonat),
      effektivSteuer: steuerJahr / jahrBrutto,
    };
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container py-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-3">
            <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zum Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" /> Brutto-Netto-Rechner
          </h1>
          <p className="text-muted-foreground">Was bleibt am Ende des Monats übrig? Schätzung für Angestellte</p>
        </div>
      </header>

      <main className="container py-10 max-w-3xl space-y-6">
        <Card className="p-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brutto">Bruttogehalt pro Monat (€)</Label>
              <Input
                id="brutto" type="number" min="0" step="50" value={brutto}
                onChange={(e) => setBrutto(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Steuerklasse</Label>
              <Select value={steuerklasse} onValueChange={setSteuerklasse}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Klasse 1 (ledig)</SelectItem>
                  <SelectItem value="2">Klasse 2 (alleinerziehend)</SelectItem>
                  <SelectItem value="3">Klasse 3 (verheiratet, Partner Klasse 5)</SelectItem>
                  <SelectItem value="4">Klasse 4 (verheiratet, beide arbeiten)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kirchensteuer</Label>
              <Select value={kirche} onValueChange={setKirche}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nein">Nein / kirchensteuerfrei</SelectItem>
                  <SelectItem value="8">Ja (8 %, z. B. Hessen)</SelectItem>
                  <SelectItem value="9">Ja (9 %, z. B. Bayern)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kinder</Label>
              <Select value={kind ? 'ja' : 'nein'} onValueChange={(v) => setKind(v === 'ja')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ja">Ja (kein Pflege-Zuschlag)</SelectItem>
                  <SelectItem value="nein">Nein (Zuschlag ab 23)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {steuerklasse === '3' && (
            <p className="text-xs text-muted-foreground">
              Klasse 3 ist stark vereinfacht berechnet (Splitting ohne Klasse-5/6-Anteile). Der echte Wert kann abweichen.
            </p>
          )}
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
          <p className="text-white/80 text-sm font-medium">Nettogehalt (Schätzung)</p>
          <p className="text-4xl md:text-5xl font-bold mt-1">{euro(result.netto)}</p>
          <p className="text-white/80 text-sm mt-2">
            von {euro(parseFloat(brutto) || 0)} brutto · ca. {Math.round((result.netto / (parseFloat(brutto) || 1)) * 100)} % bleiben dir
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-foreground mb-4">Abzüge im Detail (monatlich)</h2>
          <div className="space-y-2">
            {[
              ['Rentenversicherung', result.rv, 'Arbeitnehmeranteil'],
              ['Arbeitslosenversicherung', result.av, 'Arbeitnehmeranteil'],
              ['Krankenversicherung', result.kv, 'inkl. Zusatzbeitrag'],
              ['Pflegeversicherung', result.pv, kind ? 'mit Kind' : 'mit Kinderlosen-Zuschlag'],
              ['Lohnsteuer + Soli + Kirchensteuer', result.lohnsteuerMonat, 'Schätzung'],
            ].map(([label, wert, hinweis]) => (
              <div key={label as string} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{label as string}</p>
                  <p className="text-xs text-muted-foreground">{hinweis as string}</p>
                </div>
                <p className="text-sm font-semibold text-foreground tabular-nums">− {euro(wert as number)}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Effektive Steuerbelastung: ca. {(result.effektivSteuer * 100).toFixed(1)} % des Jahresbruttos.
          </p>
        </Card>

        <Card className="p-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/80">
              <strong>Hinweis:</strong> Dies ist eine vereinfachte Schätzung (Steuerjahr 2025/26, inkl. Pauschalen),
              keine exakte Lohnsteuerberechnung. Steuerklassen 5 und 6 sind bewusst nicht enthalten – deren Abzug
              funktioniert nach einem anderen Verfahren. Verbindliche Werte stehen auf deiner Lohnabrechnung.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}
