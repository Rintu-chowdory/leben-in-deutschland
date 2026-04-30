import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const requiredDocuments = [
  { id: 'passport', label: 'Valid passport or ID card' },
  { id: 'proof-residence', label: 'Proof of residence (rental agreement)' },
  { id: 'employment', label: 'Employment contract or proof of income' },
  { id: 'health-insurance', label: 'Health insurance confirmation' },
  { id: 'registration-form', label: 'Completed registration form (Anmeldungsformular)' },
];

const steps = [
  {
    title: 'Gather Documents',
    description: 'Collect all required documents listed below',
    details: 'Ensure all documents are original or certified copies. Some offices may require translations.',
  },
  {
    title: 'Find Local Office',
    description: 'Locate your nearest registration office (Anmeldestelle)',
    details: 'Use the office finder below to search by city. Most offices require appointments.',
  },
  {
    title: 'Schedule Appointment',
    description: 'Book an appointment if required',
    details: 'Many offices allow online booking. Call ahead to confirm requirements.',
  },
  {
    title: 'Complete Registration',
    description: 'Visit the office with all documents',
    details: 'The process typically takes 15-30 minutes. You\'ll receive a registration certificate.',
  },
];

export default function AnmeldungModule() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set());

  const { data: cities, isLoading: citiesLoading } = trpc.anmeldung.getCities.useQuery();
  const { data: offices, isLoading: officesLoading } = trpc.anmeldung.getOffices.useQuery(
    { city: selectedCity || undefined },
    { enabled: !!selectedCity }
  );

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleDocCheck = (id: string) => {
    const newChecked = new Set(checkedDocs);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedDocs(newChecked);
  };

  const docsCompletion = Math.round((checkedDocs.size / requiredDocuments.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container py-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">Anmeldung Assistance</h1>
          <p className="text-lg text-muted-foreground">
            Complete step-by-step guidance for German registration
          </p>
        </div>
      </header>

      <main className="container py-12">
        {/* Overview */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">What is Anmeldung?</h2>
          <p className="text-foreground mb-4">
            Anmeldung is the official registration of your residence with the local registration office (Anmeldestelle). 
            It's a legal requirement in Germany and must be completed within 14 days of moving to a new address.
          </p>
          <p className="text-foreground">
            This registration is essential for obtaining a German tax ID, opening a bank account, and accessing public services.
          </p>
        </Card>

        {/* Steps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Registration Steps</h2>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <Card key={idx} className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {step.description}
                    </p>
                    <p className="text-sm text-foreground">
                      {step.details}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Required Documents */}
        <div className="mb-12">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Required Documents</h2>
            
            <div className="mb-6">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${docsCompletion}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {docsCompletion}% of documents prepared
              </p>
            </div>

            <div className="space-y-3">
              {requiredDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 transition-colors">
                  <Checkbox 
                    checked={checkedDocs.has(doc.id)}
                    onCheckedChange={() => handleDocCheck(doc.id)}
                  />
                  <span className="text-foreground">{doc.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">Pro Tip</p>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                    Get certified copies of all documents in advance. Some offices may require translations into German.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Office Locator */}
        <div className="mb-12">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Find Your Registration Office</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Select City
              </label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a city..." />
                </SelectTrigger>
                <SelectContent>
                  {citiesLoading ? (
                    <div className="p-2 text-center text-muted-foreground">Loading cities...</div>
                  ) : (
                    cities?.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedCity && (
              <div className="space-y-4">
                {officesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : offices && offices.length > 0 ? (
                  offices.map((office) => (
                    <div key={office.id} className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{office.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{office.address}</p>
                          {office.phone && (
                            <p className="text-sm text-muted-foreground">📞 {office.phone}</p>
                          )}
                          {office.website && (
                            <a 
                              href={office.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline mt-2 inline-block"
                            >
                              Visit Website →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No offices found for this city. Please try another.
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Additional Resources */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="https://www.bamf.de/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors"
            >
              <p className="font-semibold text-foreground">BAMF (Federal Office)</p>
              <p className="text-sm text-muted-foreground mt-1">Official German integration resources</p>
            </a>
            <a 
              href="https://www.make-it-in-germany.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors"
            >
              <p className="font-semibold text-foreground">Make it in Germany</p>
              <p className="text-sm text-muted-foreground mt-1">Official government information portal</p>
            </a>
          </div>
        </Card>
      </main>
    </div>
  );
}
