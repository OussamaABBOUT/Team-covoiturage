export type AuthUser = {
    id: number;
    email: string;
    role: "PASSAGER" | "CONDUCTEUR" | "ADMIN";
  };
  
  export function saveSession(token: string, user: AuthUser) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
  
  export function getToken() {
    return localStorage.getItem("token");
  }
  
  export function getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem("user");
  
    if (!raw) return null;
  
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
  
  export function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  
  export function isAuthenticated() {
    return !!getToken();
  }