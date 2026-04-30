import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Star, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

export default function BankModule() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: banks, isLoading } = trpc.banks.getRecommendations.useQuery();

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Bank Account Setup</h1>
          <p className="text-lg text-muted-foreground">
            Compare recommended banks and open your account
          </p>
        </div>
      </header>

      <main className="container py-12">
        {/* Overview */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why You Need a German Bank Account</h2>
          <p className="text-foreground mb-4">
            A German bank account is essential for receiving salary, paying bills, and conducting everyday transactions. 
            Most employers and landlords require a German IBAN.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-card/50 rounded-lg">
              <p className="font-semibold text-foreground mb-2">✓ Easy Setup</p>
              <p className="text-sm text-muted-foreground">Most banks accept non-residents with valid ID</p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg">
              <p className="font-semibold text-foreground mb-2">✓ Low Fees</p>
              <p className="text-sm text-muted-foreground">Many banks offer free accounts for newcomers</p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg">
              <p className="font-semibold text-foreground mb-2">✓ Fast Process</p>
              <p className="text-sm text-muted-foreground">Online opening available with some banks</p>
            </div>
          </div>
        </Card>

        {/* Bank Comparison */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recommended Banks</h2>
          
          {isLoading ? (
            <Card className="p-8 text-center text-muted-foreground">
              Loading bank recommendations...
            </Card>
          ) : banks && banks.length > 0 ? (
            <div className="space-y-4">
              {banks.map((bank) => (
                <Card key={bank.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="grid md:grid-cols-4 gap-4 items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{bank.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {bank.type === 'online' && '🌐 Online Bank'}
                        {bank.type === 'traditional' && '🏦 Traditional Bank'}
                        {bank.type === 'neo-bank' && '📱 Neo-Bank'}
                      </p>
                      {bank.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(Number(bank.rating) || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">({bank.reviewCount} reviews)</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Monthly Fee</p>
                      <p className="text-lg font-bold text-foreground">
                        {bank.monthlyFee ? `€${bank.monthlyFee}` : 'Free'}
                      </p>
                      {bank.accountOpeningBonus && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          🎁 {bank.accountOpeningBonus}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Features</p>
                      <div className="space-y-1">
                        {bank.englishSupport && (
                          <p className="text-sm text-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            English Support
                          </p>
                        )}
                        {bank.features && bank.features.length > 0 && (
                          <p className="text-sm text-foreground">
                            {bank.features.slice(0, 2).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {bank.affiliateLink && (
                        <a 
                          href={bank.affiliateLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex"
                        >
                          <Button className="w-full">
                            Open Account
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </a>
                      )}
                      <Button variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              No banks available yet
            </Card>
          )}
        </div>

        {/* Steps */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">How to Open an Account</h2>
          <div className="space-y-4">
            {[
              {
                title: 'Choose a Bank',
                description: 'Select from the recommended banks above based on your needs',
              },
              {
                title: 'Prepare Documents',
                description: 'Have your passport, proof of residence, and employment contract ready',
              },
              {
                title: 'Apply Online or In-Person',
                description: 'Most banks allow online applications. Some require in-person verification.',
              },
              {
                title: 'Verify Identity',
                description: 'Complete video verification or visit a branch with your documents',
              },
              {
                title: 'Receive IBAN',
                description: 'Get your German IBAN and start using your account',
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
              <p className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Pro Tips</p>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>• Compare monthly fees and features before choosing</li>
                <li>• Many online banks offer higher interest rates on savings</li>
                <li>• Keep your account active to avoid closure</li>
                <li>• Some banks offer special bonuses for newcomers</li>
                <li>• You can have multiple accounts at different banks</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
