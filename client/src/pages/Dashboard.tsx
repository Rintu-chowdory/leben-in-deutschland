import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, LogOut, BookOpen, DollarSign, Heart, FileText, GraduationCap, Landmark, CheckCircle2, Clock } from "lucide-react";

const modules = [
  { id: 'anmeldung', name: 'Anmeldung', icon: Landmark, description: 'German registration' },
  { id: 'bank', name: 'Bank Account', icon: DollarSign, description: 'Bank setup guide' },
  { id: 'health', name: 'Health Insurance', icon: Heart, description: 'Insurance comparison' },
  { id: 'visa', name: 'Visa & Permits', icon: FileText, description: 'Residence permits' },
  { id: 'integration', name: 'Integration Courses', icon: GraduationCap, description: 'Course finder' },
  { id: 'tax', name: 'Tax ID', icon: BookOpen, description: 'Steueridentifikationsnummer' },
];

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const { data: allProgress } = trpc.moduleProgress.getAll.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: subscription } = trpc.subscription.getOrCreate.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getModuleProgress = (moduleId: string) => {
    return allProgress?.find(p => p.moduleName === moduleId) || null;
  };

  const totalCompletion = allProgress && allProgress.length > 0 ? Math.round(allProgress.reduce((sum, p) => sum + p.completionPercentage, 0) / allProgress.length) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.name || user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {subscription?.tier === 'premium' ? '✨ Premium' : 'Free Plan'}
              </p>
              <p className="text-xs text-muted-foreground">
                {subscription?.tier === 'free' && 'Upgrade for more features'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Overall Progress */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Your Progress</h2>
          <div className="flex items-center gap-8">
            <div className="flex-1">
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${totalCompletion}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {totalCompletion}% complete across all modules
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-primary">{totalCompletion}%</p>
              <p className="text-sm text-muted-foreground">Overall</p>
            </div>
          </div>
        </Card>

        {/* Modules Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Modules</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              const progress = getModuleProgress(module.id);
              const completion = progress?.completionPercentage || 0;

              const moduleRoutes: { [key: string]: string } = {
                'anmeldung': '/module/anmeldung',
                'bank': '/module/bank',
                'health': '/module/health',
                'visa': '/module/visa',
                'integration': '/module/integration',
                'tax': '/module/tax',
              };

              return (
                <Card 
                  key={module.id} 
                  className="p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(moduleRoutes[module.id] || '/dashboard')}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                    {completion === 100 && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {module.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {module.description}
                  </p>
                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {completion}% complete
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Modules Started</p>
                <p className="text-3xl font-bold text-foreground">
                  {allProgress?.length || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-primary opacity-50" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-foreground">
                  {allProgress?.filter(p => p.completionPercentage === 100).length || 0}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saved Resources</p>
                <p className="text-3xl font-bold text-foreground">
                  {allProgress?.reduce((sum, p) => sum + (p.savedResources?.length || 0), 0) || 0}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-primary opacity-50" />
            </div>
          </Card>
        </div>

        {/* Premium CTA */}
        {subscription?.tier === 'free' && (
          <Card className="p-8 mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Unlock Premium Features
                </h3>
                <p className="text-muted-foreground">
                  Get priority support, advanced analytics, and exclusive resources
                </p>
              </div>
              <Button onClick={() => navigate('/pricing')}>
                Upgrade to Premium
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
