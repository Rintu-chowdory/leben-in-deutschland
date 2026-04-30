import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState } from "react";
import { FileText, CheckCircle2, AlertCircle, Download } from "lucide-react";

const checklistItems = [
  { id: 'passport', label: 'Valid passport or ID card' },
  { id: 'residence', label: 'Proof of German residence (Anmeldung certificate)' },
  { id: 'employment', label: 'Employment contract or proof of income' },
  { id: 'form', label: 'Completed application form (if required)' },
  { id: 'contact', label: 'Valid contact information (phone, email)' },
];

export default function TaxIDModule() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const downloadChecklist = () => {
    const checklistText = `
STEUERIDENTIFIKATIONSNUMMER (TAX ID) CHECKLIST
================================================

Required Documents:
${checklistItems.map(item => `☐ ${item.label}`).join('\n')}

Application Steps:
1. Register your residence (Anmeldung)
2. Receive Tax ID automatically by mail
3. No application needed for most cases

Processing Time:
- Usually 1-2 weeks after Anmeldung
- Tax ID sent by mail to your registered address

Important Information:
- Tax ID is a 11-digit number
- Keep it safe and use for all tax matters
- Required for employment and banking
- Valid for life

Contact Information:
- Bundeszentralamt für Steuern (BZSt)
- Website: www.bzst.bund.de
- Phone: +49 (0) 228 406-0

Generated on: ${new Date().toLocaleDateString()}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(checklistText));
    element.setAttribute('download', 'Tax-ID-Checklist.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const completion = Math.round((checkedItems.size / checklistItems.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container py-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">Tax ID Application Help</h1>
          <p className="text-lg text-muted-foreground">
            Complete guide to obtaining your Steueridentifikationsnummer
          </p>
        </div>
      </header>

      <main className="container py-12">
        {/* Overview */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">What is Steueridentifikationsnummer?</h2>
          <p className="text-foreground mb-4">
            The Steueridentifikationsnummer (Tax ID) is an 11-digit number assigned to every person registered in Germany. 
            It's used for all tax-related matters and is essential for employment, banking, and other administrative processes.
          </p>
          <p className="text-foreground mb-4">
            Good news: You don't need to apply for it! The Tax ID is automatically assigned when you register your residence (Anmeldung) 
            and sent to your address by mail within 1-2 weeks.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="font-semibold text-green-900 dark:text-green-200 mb-2">✓ Automatic</p>
              <p className="text-sm text-green-800 dark:text-green-300">No application needed</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="font-semibold text-green-900 dark:text-green-200 mb-2">✓ Free</p>
              <p className="text-sm text-green-800 dark:text-green-300">No fees involved</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="font-semibold text-green-900 dark:text-green-200 mb-2">✓ Lifelong</p>
              <p className="text-sm text-green-800 dark:text-green-300">Valid for your entire life</p>
            </div>
          </div>
        </Card>

        {/* Preparation Checklist */}
        <Card className="p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Preparation Checklist</h2>
            <Button onClick={downloadChecklist} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="mb-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {completion}% of preparations complete
            </p>
          </div>

          <div className="space-y-3">
            {checklistItems.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 transition-colors cursor-pointer"
                onClick={() => handleCheck(item.id)}
              >
                <input
                  type="checkbox"
                  checked={checkedItems.has(item.id)}
                  onChange={() => handleCheck(item.id)}
                  className="w-4 h-4"
                />
                <span className={checkedItems.has(item.id) ? 'line-through text-muted-foreground' : 'text-foreground'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* How to Get Tax ID */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">How to Get Your Tax ID</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Register Your Residence (Anmeldung)',
                description: 'Complete your Anmeldung at the local registration office within 14 days of arrival',
                details: 'This is the most important step. Your Tax ID is automatically generated when you register.',
              },
              {
                step: 2,
                title: 'Wait for Mail',
                description: 'The Tax ID will be sent to your registered address by mail',
                details: 'Processing typically takes 1-2 weeks. The letter comes from the Bundeszentralamt für Steuern (BZSt).',
              },
              {
                step: 3,
                title: 'Receive Your Tax ID',
                description: 'Your 11-digit Tax ID will be in the letter',
                details: 'Keep this number safe. You\'ll need it for employment, banking, and tax purposes.',
              },
              {
                step: 4,
                title: 'Use Your Tax ID',
                description: 'Provide it to your employer and bank',
                details: 'Your employer needs it for payroll. Your bank may request it for account setup.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-4 border border-border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  <p className="text-xs text-muted-foreground mt-2 italic">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Important Information */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Important Information</h2>
          <div className="space-y-4">
            <div className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground mb-2">Format</p>
              <p className="text-sm text-foreground">
                11-digit number, for example: 12 345 678 901
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground mb-2">Validity</p>
              <p className="text-sm text-foreground">
                Your Tax ID is valid for your entire life and never changes
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground mb-2">Uses</p>
              <p className="text-sm text-foreground">
                Employment, banking, tax declarations, insurance, and all official matters
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground mb-2">Lost or Not Received</p>
              <p className="text-sm text-foreground">
                Contact the Bundeszentralamt für Steuern (BZSt) at +49 (0) 228 406-0 or visit www.bzst.bund.de
              </p>
            </div>
          </div>
        </Card>

        {/* Official Resources */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Official Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="https://www.bzst.bund.de/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors"
            >
              <p className="font-semibold text-foreground">Bundeszentralamt für Steuern</p>
              <p className="text-sm text-muted-foreground mt-1">Official German tax authority website</p>
            </a>
            <a 
              href="https://www.make-it-in-germany.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 border border-border rounded-lg hover:bg-card/50 transition-colors"
            >
              <p className="font-semibold text-foreground">Make it in Germany</p>
              <p className="text-sm text-muted-foreground mt-1">Government information portal for newcomers</p>
            </a>
          </div>
        </Card>

        {/* Pro Tips */}
        <Card className="p-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-200 mb-3">Pro Tips</p>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>• Complete your Anmeldung as soon as possible after arrival</li>
                <li>• Keep your Tax ID letter in a safe place</li>
                <li>• You may need to provide it to your employer before your first day</li>
                <li>• If you don't receive it within 3 weeks, contact BZSt</li>
                <li>• Your Tax ID is different from your social security number</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
