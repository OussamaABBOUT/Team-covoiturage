"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, type AuthUser } from "@/lib/auth-client";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <main className="pageContainer">
        <div className="pageHeader">
          <h1>Administration</h1>
          <p>Chargement...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Panneau d’administration</h1>
        <p>
          Bienvenue <strong>{user.email}</strong>. Gérez la plateforme de
          covoiturage depuis cet espace administrateur.
        </p>
      </div>

      <section className="dashboardGrid">
        <Link href="/admin/users" className="dashboardCard">
          <h2>Gérer les utilisateurs</h2>
          <p>Activer, désactiver et consulter les comptes utilisateurs.</p>
        </Link>

        <Link href="/trips" className="dashboardCard">
          <h2>Voir les trajets</h2>
          <p>Consultez les trajets disponibles sur la plateforme.</p>
        </Link>

        <Link href="/history" className="dashboardCard">
          <h2>Historique</h2>
          <p>Consultez l’historique global des activités.</p>
        </Link>

        <Link href="/dashboard" className="dashboardCard">
          <h2>Retour au dashboard</h2>
          <p>Revenir au tableau de bord principal.</p>
        </Link>
      </section>
    </main>
  );
}