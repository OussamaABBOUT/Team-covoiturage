"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

type UserItem = {
  id: number;
  collegeId: string;
  email: string;
  role: string;
  isActive: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      setError("");
      const data = await apiGet("/admin/users");
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur utilisateurs");
    } finally {
      setLoading(false);
    }
  }

  async function toggleUser(userId: number, isActive: boolean) {
    try {
      await apiPatch("/admin/users", {
        userId,
        isActive: !isActive,
      });

      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      try {
        const data = await apiGet("/admin/users");

        if (isMounted) {
          setUsers(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Erreur utilisateurs");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Gestion des utilisateurs</h1>
        <p>Activez ou désactivez les comptes utilisateurs.</p>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="errorMessage">{error}</p>}

      {!loading &&
        !error &&
        users.map((user) => (
          <div key={user.id} className="resultCard">
            <p>
              <strong>ID collège :</strong> {user.collegeId}
            </p>
            <p>
              <strong>Email :</strong> {user.email}
            </p>
            <p>
              <strong>Rôle :</strong> {user.role}
            </p>
            <p>
              <strong>Statut :</strong> {user.isActive ? "Actif" : "Désactivé"}
            </p>

            <button
              className="btnPrimary"
              onClick={() => toggleUser(user.id, user.isActive)}
            >
              {user.isActive ? "Désactiver" : "Activer"}
            </button>
          </div>
        ))}
    </main>
  );
}