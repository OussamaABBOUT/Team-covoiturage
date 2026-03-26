"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-client";

type ReservationStatus = "PENDING" | "ACCEPTED" | "REFUSED" | "CANCELLED";

type Trip = {
  id: number;
  departure: string;
  destination: string;
  date: string;
  time?: string;
  price?: number;
};

type Reservation = {
  id: number;
  status: ReservationStatus;
  createdAt?: string;
  trip?: Trip;
};

export default function MyReservationsPage() {
  const router = useRouter();

  const [userChecked, setUserChecked] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiGet("/my-reservations");
      setReservations(Array.isArray(data) ? (data as Reservation[]) : []);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des réservations"
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

    if (user.role !== "PASSAGER" && user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    setUserChecked(true);
  }, [router]);

  useEffect(() => {
    if (userChecked) {
      loadReservations();
    }
  }, [userChecked, loadReservations]);

  async function cancelReservation(reservationId: number) {
    try {
      setError("");

      await apiPatch(`/reservations/${reservationId}`, {
        status: "CANCELLED",
      });

      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation.id !== reservationId
        )
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'annulation de la réservation"
      );
    }
  }

  if (!userChecked) {
    return (
      <main className="page">
        <p>Chargement...</p>
      </main>
    );
  }

  const visibleReservations = reservations.filter(
    (reservation) => reservation.status !== "CANCELLED"
  );

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
        ) : visibleReservations.length === 0 ? (
          <p>Aucune réservation trouvée.</p>
        ) : (
          <div className="cardGrid">
            {visibleReservations.map((reservation) => (
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

                {reservation.status !== "REFUSED" && (
                  <button
                    className="btnSecondary"
                    onClick={() => cancelReservation(reservation.id)}
                  >
                    Annuler la réservation
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}