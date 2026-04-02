"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-client";

type UserInfo = {
  id: number;
  collegeId: string;
  email: string;
  role: "PASSAGER" | "CONDUCTEUR" | "ADMIN";
  isActive: boolean;
};

type Trip = {
  id: number;
  departure: string;
  destination: string;
  date: string;
  seats: number;
  availableSeats: number;
  status?: string;
};

type Reservation = {
  id: number;
  status: string;
  createdAt: string;
  trip?: {
    id: number;
    departure: string;
    destination: string;
    date: string;
    status?: string;
  };
};

type UserHistoryResponse = {
  user: UserInfo;
  trips: Trip[];
  reservations: Reservation[];
};

export default function AdminUserDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<UserHistoryResponse | null>(null);
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

    async function loadUserHistory() {
      try {
        setError("");
        const result = await apiGet(`/admin/users/${params.id}/history`);
        setData(result);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement de l'historique"
        );
      } finally {
        setLoading(false);
      }
    }

    if (params?.id) {
      loadUserHistory();
    }
  }, [params, router]);

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Profil utilisateur</h1>
        <p>Consultez l’activité complète de cet utilisateur.</p>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="errorMessage">{error}</p>}

      {!loading && data && (
        <>
          <div className="resultCard" style={{ marginBottom: "24px" }}>
            <h3>{data.user.email}</h3>
            <p>ID collège : {data.user.collegeId}</p>
            <p>Rôle : {data.user.role}</p>
            <p>Statut : {data.user.isActive ? "Actif" : "Inactif"}</p>
          </div>

          <section style={{ marginBottom: "34px" }}>
            <div className="pageHeader">
              <h1 style={{ fontSize: "1.5rem" }}>Historique des trajets</h1>
              <p>Tous les trajets publiés par cet utilisateur.</p>
            </div>

            {data.trips.length === 0 ? (
              <p>Aucun trajet trouvé.</p>
            ) : (
              <div className="cardGrid">
                {data.trips.map((trip) => (
                  <div key={trip.id} className="resultCard">
                    <h3>
                      {trip.departure} → {trip.destination}
                    </h3>
                    <p>
                      Date : {new Date(trip.date).toLocaleDateString("fr-CA")}
                    </p>
                    <p>Places : {trip.seats}</p>
                    <p>Disponibles : {trip.availableSeats}</p>
                    <p>Statut : {trip.status || "ACTIVE"}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="pageHeader">
              <h1 style={{ fontSize: "1.5rem" }}>
                Historique des réservations
              </h1>
              <p>Toutes les réservations associées à cet utilisateur.</p>
            </div>

            {data.reservations.length === 0 ? (
              <p>Aucune réservation trouvée.</p>
            ) : (
              <div className="cardGrid">
                {data.reservations.map((reservation) => (
                  <div key={reservation.id} className="resultCard">
                    <h3>
                      {reservation.trip
                        ? `${reservation.trip.departure} → ${reservation.trip.destination}`
                        : "Trajet"}
                    </h3>
                    <p>
                      Date trajet :{" "}
                      {reservation.trip?.date
                        ? new Date(reservation.trip.date).toLocaleDateString(
                            "fr-CA"
                          )
                        : "-"}
                    </p>
                    <p>Statut réservation : {reservation.status}</p>
                    <p>
                      Demandée le :{" "}
                      {new Date(reservation.createdAt).toLocaleDateString(
                        "fr-CA"
                      )}
                    </p>
                    {reservation.trip?.status && (
                      <p>Statut trajet : {reservation.trip.status}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}