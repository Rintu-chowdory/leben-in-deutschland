import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AnmeldungModule from "./pages/AnmeldungModule";
import BankModule from "./pages/BankModule";
import HealthInsuranceModule from "./pages/HealthInsuranceModule";
import VisaModule from "./pages/VisaModule";
import IntegrationCoursesModule from "./pages/IntegrationCoursesModule";
import TaxIDModule from "./pages/TaxIDModule";
import Einbuergerungstest from "./pages/tools/Einbuergerungstest";
import Fristenrechner from "./pages/tools/Fristenrechner";

function Routes() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/module/anmeldung"} component={AnmeldungModule} />
      <Route path={"/module/bank"} component={BankModule} />
      <Route path={"/module/health"} component={HealthInsuranceModule} />
      <Route path={"/module/visa"} component={VisaModule} />
      <Route path={"/module/integration"} component={IntegrationCoursesModule} />
      <Route path={"/module/tax"} component={TaxIDModule} />
      <Route path={"/werkzeuge/einbuergerungstest"} component={Einbuergerungstest} />
      <Route path={"/werkzeuge/fristenrechner"} component={Fristenrechner} />
      <Route path={"/404"} component={NotFound} />
      {/* Fallback-Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Basispfad für das GitHub-Pages-Deployment (Vite BASE_URL), damit die wouter-Routen passen
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <WouterRouter base={base || undefined}>
            <Routes />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
