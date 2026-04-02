"use client";

import Link from "next/link";
import { useAuthUser } from "@/lib/auth-client";

export default function DashboardPage() {
  const user = useAuthUser();

  if (!user) {
    return (
      <main className="dashboardPage">
        <div className="dashboardHeader">
          <h1>Dashboard</h1>
          <p>Utilisateur non connecté.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboardPage">
      <div className="dashboardHeader">
        <h1>Bienvenue sur votre dashboard</h1>
        <p>
          Connecté en tant que <strong>{user.email}</strong>
        </p>
        <span className="roleBadge">{user.role}</span>
      </div>

      <section className="dashboardGrid">
        <Link href="/profile" className="dashboardCard">
          <h2>Mon profil</h2>
          <p>Consultez et gérez vos informations personnelles.</p>
        </Link>

        {user.role === "CONDUCTEUR" && (
          <>
            <Link href="/create-trip" className="dashboardCard">
              <h2>Proposer un trajet</h2>
              <p>Publiez un nouveau trajet rapidement.</p>
            </Link>

            <Link href="/my-trips" className="dashboardCard">
              <h2>Mes trajets</h2>
              <p>Consultez, modifiez ou annulez vos trajets publiés.</p>
            </Link>

            <Link href="/history" className="dashboardCard">
              <h2>Historique</h2>
              <p>Consultez l’historique de vos trajets et activités.</p>
            </Link>
          </>
        )}

        {user.role === "PASSAGER" && (
          <>
            <Link href="/trips" className="dashboardCard">
              <h2>Rechercher un trajet</h2>
              <p>Trouvez un trajet disponible et envoyez une réservation.</p>
            </Link>

            <Link href="/my-reservations" className="dashboardCard">
              <h2>Mes réservations</h2>
              <p>Suivez toutes vos demandes de réservation.</p>
            </Link>

            <Link href="/history" className="dashboardCard">
              <h2>Historique</h2>
              <p>Retrouvez vos réservations passées en un seul endroit.</p>
            </Link>
          </>
        )}

        {user.role === "ADMIN" && (
          <>
            <Link href="/admin" className="dashboardCard">
              <h2>Administration</h2>
              <p>Supervisez la plateforme et consultez les statistiques.</p>
            </Link>          
          </>
        )}
      </section>
    </main>
  );
}