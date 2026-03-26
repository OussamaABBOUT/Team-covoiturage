export type AuthUser = {
  id: number;
  email: string;
  role: "PASSAGER" | "CONDUCTEUR" | "ADMIN";
};

export function saveSession(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

export function getCurrentUser(): AuthUser | null {
  // ✅ Empêche l’erreur côté serveur
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem("user");

  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
}