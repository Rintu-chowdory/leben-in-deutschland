// AUTH BYPASSED FOR LOCAL DEV
export function useAuth(_options?: any) {
  return {
    user: { id: "local-dev", name: "Dev User", email: "dev@local.dev" },
    loading: false,
    error: null,
    isAuthenticated: true,
    refresh: () => {},
    logout: async () => {},
  };
}
