import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
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

function Router() {
  // make sure to consider if you need authentication for certain routes
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
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
