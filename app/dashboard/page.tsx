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
          <p>Consultez vos informations personnelles.</p>
        </Link>

        {user.role === "CONDUCTEUR" && (
          <>
            <Link href="/create-trip" className="dashboardCard">
              <h2>Proposer un trajet</h2>
              <p>Créer un nouveau trajet.</p>
            </Link>

            <Link href="/my-trips" className="dashboardCard">
              <h2>Voir mes trajets</h2>
              <p>Consultez les trajets que vous avez publiés.</p>
            </Link>

            <Link href="/history" className="dashboardCard">
              <h2>Historique de mes trajets</h2>
              <p>Consultez l’historique de vos trajets.</p>
            </Link>
          </>
        )}

        {user.role === "PASSAGER" && (
          <>
            <Link href="/trips" className="dashboardCard">
              <h2>Rechercher un trajet</h2>
              <p>Trouvez un trajet disponible.</p>
            </Link>

            <Link href="/my-reservations" className="dashboardCard">
              <h2>Voir mes réservations</h2>
              <p>Consultez vos demandes de réservation.</p>
            </Link>

            <Link href="/history" className="dashboardCard">
              <h2>Historique des réservations</h2>
              <p>Consultez vos réservations passées.</p>
            </Link>
          </>
        )}

        {user.role === "ADMIN" && (
          <>
           
            <Link href="/admin" className="dashboardCard">
              <h2>Superviser la plateforme</h2>
              <p>Consultez les données globales d’utilisation.</p>
            </Link>

          </>
        )}
      </section>
    </main>
  );
}