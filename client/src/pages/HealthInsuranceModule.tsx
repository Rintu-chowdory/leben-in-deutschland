import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function HealthInsuranceModule() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedType, setSelectedType] = useState<'gkv' | 'pkv' | null>(null);

  const { data: providers, isLoading } = trpc.healthInsurance.getProviders.useQuery(
    { type: selectedType || undefined },
    { enabled: !!selectedType }
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Health Insurance Comparison</h1>
          <p className="text-lg text-muted-foreground">
            Compare public and private insurance options
          </p>
        </div>
      </header>

      <main className="container py-12">
        {/* Overview */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Health Insurance in Germany</h2>
          <p className="text-foreground mb-4">
            Health insurance is mandatory in Germany. You must have coverage within 2 months of arrival. 
            There are two main types: public (GKV) and private (PKV) insurance.
          </p>
          <p className="text-foreground">
            Most newcomers start with public insurance (GKV), which is more affordable and covers all essential healthcare.
          </p>
        </Card>

        {/* GKV vs PKV Comparison */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">GKV vs PKV</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className={`p-6 cursor-pointer transition-all ${selectedType === 'gkv' ? 'border-primary border-2 shadow-lg' : 'hover:shadow-lg'}`}
              onClick={() => setSelectedType('gkv')}
            >
              <h3 className="text-xl font-bold text-foreground mb-4">GKV (Public)</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Mandatory for most employees</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Income-based contributions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Comprehensive coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Family members can be insured</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Recommended for newcomers</span>
                </li>
              </ul>
            </Card>

            <Card 
              className={`p-6 cursor-pointer transition-all ${selectedType === 'pkv' ? 'border-primary border-2 shadow-lg' : 'hover:shadow-lg'}`}
              onClick={() => setSelectedType('pkv')}
            >
              <h3 className="text-xl font-bold text-foreground mb-4">PKV (Private)</h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Optional for self-employed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Fixed monthly premiums</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Customizable coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Potentially lower costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Age-dependent premiums</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Providers */}
        {selectedType && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {selectedType === 'gkv' ? 'Public Insurance Providers' : 'Private Insurance Providers'}
            </h2>
            
            {isLoading ? (
              <Card className="p-8 text-center text-muted-foreground">
                Loading providers...
              </Card>
            ) : providers && providers.length > 0 ? (
              <div className="space-y-4">
                {providers.map((provider) => (
                  <Card key={provider.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{provider.name}</h3>
                        {provider.englishSupport && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            ✓ English Support Available
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Monthly Contribution</p>
                        <p className="text-lg font-bold text-foreground">
                          {provider.monthlyContribution ? `€${provider.monthlyContribution}` : 'Variable'}
                        </p>
                        {provider.deductible && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Deductible: €{provider.deductible}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {provider.website && (
                          <a 
                            href={provider.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button className="w-full">
                              Visit Website
                            </Button>
                          </a>
                        )}
                        <Button variant="outline" className="w-full">
                          Learn More
                        </Button>
                      </div>
                    </div>

                    {provider.features && provider.features.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm font-semibold text-foreground mb-2">Key Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {provider.features.map((feature, idx) => (
                            <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                No providers available yet
              </Card>
            )}
          </div>
        )}

        {/* Steps */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">How to Get Insured</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Choose Insurance Type',
                description: 'Decide between public (GKV) and private (PKV) insurance',
              },
              {
                title: 'Select a Provider',
                description: 'Compare providers and choose one that suits your needs',
              },
              {
                title: 'Prepare Documents',
                description: 'Have your passport, residence registration, and employment contract ready',
              },
              {
                title: 'Submit Application',
                description: 'Apply online or visit the provider office',
              },
              {
                title: 'Receive Confirmation',
                description: 'Get your insurance card and start coverage',
              },
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4 p-4 border border-border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {idx + 1}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{step.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pro Tips */}
        <Card className="p-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Important Tips</p>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>• You must register for insurance within 2 months of arrival</li>
                <li>• GKV is typically cheaper for employees</li>
                <li>• PKV offers more flexibility and choice</li>
                <li>• Some employers contribute to insurance costs</li>
                <li>• You can switch providers annually</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
