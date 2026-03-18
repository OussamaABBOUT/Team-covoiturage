"use client";

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-client";

export default function DashboardPage() {
  const user = getCurrentUser();

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
        <h1>Bienvenue</h1>
        <p>
          Connecté en tant que <strong>{user.email}</strong>
        </p>
        <span className="roleBadge">{user.role}</span>
      </div>

      {user.role === "PASSAGER" && (
        <section className="dashboardGrid">
          <Link href="/trips" className="dashboardCard">
            <h2>Rechercher un trajet</h2>
            <p>Trouvez un trajet disponible selon votre destination et la date.</p>
          </Link>

          <Link href="/my-reservations" className="dashboardCard">
            <h2>Mes réservations</h2>
            <p>Consultez vos demandes de réservation et leur statut.</p>
          </Link>

          <Link href="/history" className="dashboardCard">
            <h2>Historique</h2>
            <p>Consultez vos trajets passés en tant que passager.</p>
          </Link>

          <Link href="/profile" className="dashboardCard">
            <h2>Mon profil</h2>
            <p>Consultez et modifiez vos informations personnelles.</p>
          </Link>
        </section>
      )}

      {user.role === "CONDUCTEUR" && (
        <section className="dashboardGrid">
          <Link href="/create-trip" className="dashboardCard">
            <h2>Proposer un trajet</h2>
            <p>Créez un nouveau trajet avec départ, destination, date et places.</p>
          </Link>

          <Link href="/my-trips" className="dashboardCard">
            <h2>Mes trajets</h2>
            <p>Consultez vos trajets publiés et les demandes reçues.</p>
          </Link>

          <Link href="/history" className="dashboardCard">
            <h2>Historique</h2>
            <p>Consultez vos anciens trajets en tant que conducteur.</p>
          </Link>

          <Link href="/profile" className="dashboardCard">
            <h2>Mon profil</h2>
            <p>Gérez vos informations et votre compte.</p>
          </Link>
        </section>
      )}

      {user.role === "ADMIN" && (
        <section className="dashboardGrid">
          <Link href="/admin" className="dashboardCard">
            <h2>Administration</h2>
            <p>Consultez les statistiques et gérez les utilisateurs.</p>
          </Link>

          <Link href="/trips" className="dashboardCard">
            <h2>Voir les trajets</h2>
            <p>Consultez les trajets disponibles sur la plateforme.</p>
          </Link>

          <Link href="/history" className="dashboardCard">
            <h2>Historique</h2>
            <p>Accédez aux données utiles pour la supervision.</p>
          </Link>

          <Link href="/profile" className="dashboardCard">
            <h2>Mon profil</h2>
            <p>Consultez les informations de votre compte administrateur.</p>
          </Link>
        </section>
      )}
    </main>
  );
}