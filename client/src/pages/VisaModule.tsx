import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function VisaModule() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedPermit, setSelectedPermit] = useState<string | null>(null);

  const { data: permits, isLoading } = trpc.visa.getPermitTypes.useQuery();
  const { data: selectedPermitDetails } = trpc.visa.getPermitByCode.useQuery(
    { code: selectedPermit || '' },
    { enabled: !!selectedPermit }
  );

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container py-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">Visa & Residence Permits</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive guidance on German residence permits
          </p>
        </div>
      </header>

      <main className="container py-12">
        {/* Overview */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Residence Permits in Germany</h2>
          <p className="text-foreground mb-4">
            Germany offers various residence permits depending on your purpose of stay. The type of permit you need 
            depends on your employment status, education, or family situation.
          </p>
          <p className="text-foreground">
            Most work-related permits are issued for 2-5 years and can be extended. EU citizens have special rights 
            and do not need a visa.
          </p>
        </Card>

        {/* Permit Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Permit Types</h2>
          
          {isLoading ? (
            <Card className="p-8 text-center text-muted-foreground">
              Loading permit types...
            </Card>
          ) : permits && permits.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {permits.map((permit) => (
                <Card 
                  key={permit.id}
                  className={`p-6 cursor-pointer transition-all ${selectedPermit === permit.code ? 'border-primary border-2 shadow-lg' : 'hover:shadow-lg'}`}
                  onClick={() => setSelectedPermit(permit.code)}
                >
                  <h3 className="text-lg font-bold text-foreground mb-2">{permit.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{permit.description}</p>
                  
                  {permit.validityPeriod && (
                    <div className="flex items-center gap-2 text-sm text-foreground mb-2">
                      <Clock className="w-4 h-4" />
                      <span>Valid: {permit.validityPeriod}</span>
                    </div>
                  )}
                  
                  {permit.processingTime && (
                    <p className="text-xs text-muted-foreground">
                      Processing time: {permit.processingTime}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              No permit types available yet
            </Card>
          )}
        </div>

        {/* Selected Permit Details */}
        {selectedPermit && selectedPermitDetails && (
          <div className="mb-12 space-y-6">
            {/* Eligibility */}
            {selectedPermitDetails.eligibilityCriteria && selectedPermitDetails.eligibilityCriteria.length > 0 && (
              <Card className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-4">Eligibility Criteria</h3>
                <ul className="space-y-2">
                  {selectedPermitDetails.eligibilityCriteria.map((criterion, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Required Documents */}
            {selectedPermitDetails.requiredDocuments && selectedPermitDetails.requiredDocuments.length > 0 && (
              <Card className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Required Documents
                </h3>
                <ul className="space-y-2">
                  {selectedPermitDetails.requiredDocuments.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-card/50 rounded">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground text-sm">{doc}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Application Steps */}
            {selectedPermitDetails.applicationSteps && selectedPermitDetails.applicationSteps.length > 0 && (
              <Card className="p-8">
                <h3 className="text-xl font-bold text-foreground mb-4">Application Steps</h3>
                <div className="space-y-4">
                  {selectedPermitDetails.applicationSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* General Information */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">General Information</h2>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground mb-2">Where to Apply</p>
              <p className="text-sm text-foreground">
                Apply at the local immigration office (Ausländerbehörde) in your city
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground mb-2">Processing Time</p>
              <p className="text-sm text-foreground">
                Typically 4-12 weeks, depending on the permit type and completeness of application
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground mb-2">Costs</p>
              <p className="text-sm text-foreground">
                Fees range from €75 to €100, depending on the permit type and processing time
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground mb-2">Extensions</p>
              <p className="text-sm text-foreground">
                Most permits can be extended before expiration. Apply 6-8 weeks before expiry
              </p>
            </div>
          </div>
        </Card>

        {/* Pro Tips */}
        <Card className="p-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Important Tips</p>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>• Apply as early as possible to avoid delays</li>
                <li>• Keep copies of all submitted documents</li>
                <li>• Some documents may require official German translation</li>
                <li>• Schedule appointments online when possible</li>
                <li>• EU citizens don't need a visa but should register residence</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
