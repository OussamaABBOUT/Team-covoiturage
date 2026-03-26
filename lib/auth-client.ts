"use client";

import { useMemo, useSyncExternalStore } from "react";

export type AuthUser = {
  id: number;
  email: string;
  role: "PASSAGER" | "CONDUCTEUR" | "ADMIN";
};

function readUserString(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user");
}

function readTokenString(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function emitAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("auth-change"));
}

export function saveSession(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  emitAuthChange();
}

export function getToken(): string | null {
  return readTokenString();
}

export function getCurrentUser(): AuthUser | null {
  const raw = readUserString();
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
  emitAuthChange();
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => callback();

  window.addEventListener("storage", handler);
  window.addEventListener("auth-change", handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("auth-change", handler);
  };
}

export function useAuthUser(): AuthUser | null {
  const rawUser = useSyncExternalStore(subscribe, readUserString, () => null);

  return useMemo(() => {
    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      return null;
    }
  }, [rawUser]);
}