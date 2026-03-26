"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-client";

type Reservation = {
  id: number;
  status: string;
  createdAt?: string;
  trip?: {
    id: number;
    departure: string;
    destination: string;
    date: string;
    time?: string;
    price?: number;
  };
};

export default function MyReservationsPage() {
  const router = useRouter();

  const [userChecked, setUserChecked] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "PASSAGER" && user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    setUserChecked(true);
    loadReservations();
  }, [router]);

  async function loadReservations() {
    try {
      setLoading(true);
      setError("");

      const data = await apiGet("/my-reservations");
      setReservations(Array.isArray(data) ? data : data.reservations || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des réservations"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!userChecked) {
    return <main className="page"><p>Chargement...</p></main>;
  }

  return (
    <main className="page">
      <div className="pageHeader">
        <h1>Mes réservations</h1>
        <p>Consultez toutes vos demandes de réservation.</p>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <section className="listSection">
        {loading ? (
          <p>Chargement des réservations...</p>
        ) : reservations.length === 0 ? (
          <p>Aucune réservation trouvée.</p>
        ) : (
          <div className="cardGrid">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="dashboardCard">
                <h2>
                  {reservation.trip
                    ? `${reservation.trip.departure} → ${reservation.trip.destination}`
                    : "Trajet"}
                </h2>

                {reservation.trip?.date && (
                  <p>
                    <strong>Date :</strong>{" "}
                    {new Date(reservation.trip.date).toLocaleDateString("fr-CA")}
                  </p>
                )}

                {reservation.trip?.time && (
                  <p>
                    <strong>Heure :</strong> {reservation.trip.time}
                  </p>
                )}

                {typeof reservation.trip?.price !== "undefined" && (
                  <p>
                    <strong>Prix :</strong> {reservation.trip.price} $
                  </p>
                )}

                <p>
                  <strong>Statut :</strong> {reservation.status}
                </p>

                {reservation.createdAt && (
                  <p>
                    <strong>Demandée le :</strong>{" "}
                    {new Date(reservation.createdAt).toLocaleDateString("fr-CA")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}