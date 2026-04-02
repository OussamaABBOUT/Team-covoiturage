"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-client";

type UserItem = {
  id: number;
  collegeId: string;
  email: string;
  role: "PASSAGER" | "CONDUCTEUR" | "ADMIN";
  isActive: boolean;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setError("");
      const data = await apiGet("/admin/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des utilisateurs"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    loadUsers();
  }, [router, loadUsers]);

  async function toggleUser(userId: number, isActive: boolean) {
    try {
      await apiPatch(`/admin/users/${userId}`, {
        isActive: !isActive,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive: !isActive } : user
        )
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  }

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Gestion des utilisateurs</h1>
        <p>Activez ou désactivez les comptes utilisateurs.</p>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="errorMessage">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p>Aucun utilisateur trouvé.</p>
      )}

      {!loading &&
        !error &&
        users.map((user) => (
          <div key={user.id} className="resultCard">
            <h3>{user.email}</h3>
            <p>ID collège : {user.collegeId}</p>
            <p>Rôle : {user.role}</p>
            <p>Statut : {user.isActive ? "Actif" : "Inactif"}</p>

            <button
              className={user.isActive ? "btnSecondary" : "btnPrimary"}
              onClick={() => toggleUser(user.id, user.isActive)}
            >
              {user.isActive ? "Désactiver" : "Activer"}
            </button>
          </div>
        ))}
    </main>
  );
}