"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { getCurrentUser, type AuthUser } from "@/lib/auth-client";

type AdminStats = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalTrips: number;
  activeTrips: number;
  cancelledTrips: number;
  totalReservations: number;
  pendingReservations: number;
  acceptedReservations: number;
  refusedReservations: number;
  cancelledReservations: number;
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, [router]);

  useEffect(() => {
    async function loadStats() {
      try {
        setError("");
        const data = await apiGet("/admin/stats");
        setStats(data);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des statistiques"
        );
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadStats();
    }
  }, [user]);

  if (!user) {
    return (
      <main className="pageContainer">
        <div className="pageHeader">
          <h1>Administration</h1>
          <p>Chargement...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Panneau d’administration</h1>
        <p>
          Bienvenue <strong>{user.email}</strong>. Gérez les comptes,
          surveillez l’activité et consultez les statistiques globales.
        </p>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      {loading ? (
        <p>Chargement des statistiques...</p>
      ) : stats ? (
        <>
          <section className="kpiGrid">
            <div className="kpi">
              <div className="num">{stats.totalUsers}</div>
              <div className="label">Utilisateurs</div>
            </div>

            <div className="kpi">
              <div className="num">{stats.totalTrips}</div>
              <div className="label">Trajets</div>
            </div>

            <div className="kpi">
              <div className="num">{stats.totalReservations}</div>
              <div className="label">Réservations</div>
            </div>
          </section>

          <section className="dashboardGrid">
            <div className="dashboardCard">
              <h2>Utilisateurs</h2>
              <p>Actifs : {stats.activeUsers}</p>
              <p>Inactifs : {stats.inactiveUsers}</p>
            </div>

            <div className="dashboardCard">
              <h2>Trajets</h2>
              <p>Actifs : {stats.activeTrips}</p>
              <p>Annulés : {stats.cancelledTrips}</p>
            </div>

            <div className="dashboardCard">
              <h2>Réservations</h2>
              <p>En attente : {stats.pendingReservations}</p>
              <p>Acceptées : {stats.acceptedReservations}</p>
              <p>Refusées : {stats.refusedReservations}</p>
              <p>Annulées : {stats.cancelledReservations}</p>
            </div>

            <Link href="/admin/users" className="dashboardCard">
              <h2>Gérer les utilisateurs</h2>
              <p>Activer ou désactiver les comptes utilisateurs.</p>
            </Link>
          </section>
        </>
      ) : null}
    </main>
  );
}