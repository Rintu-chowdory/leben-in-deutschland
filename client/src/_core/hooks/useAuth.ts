// Gast-Modus: Die App funktioniert komplett ohne Backend (statisches Deployment).
// Für die lokale Entwicklung mit Auth die folgende Zeile aktivieren:
// import { useAuth as useRealAuth } from "./useRealAuth";

export function useAuth(_options?: any) {
  return {
    user: null as { name: string; email: string } | null,
    loading: false,
    error: null,
    isAuthenticated: false,
    refresh: () => {},
    logout: async () => {},
  };
}
