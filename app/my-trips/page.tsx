"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

type Passenger = {
  id: number;
  email: string;
  role: "PASSAGER" | "CONDUCTEUR" | "ADMIN";
};

type ReservationStatus = "PENDING" | "ACCEPTED" | "REFUSED" | "CANCELLED";
type TripStatus = "ACTIVE" | "CANCELLED";

type Reservation = {
  id: number;
  status: ReservationStatus;
  passenger: Passenger;
};

type Trip = {
  id: number;
  departure: string;
  destination: string;
  date: string;
  availableSeats: number;
  seats: number;
  status?: TripStatus;
  reservations: Reservation[];

};

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const loadTrips = useCallback(async () => {
    try {
      setError("");
      const data = await apiGet("/my-trips");
      setTrips(Array.isArray(data) ? (data as Trip[]) : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, []);

  async function updateReservation(
    reservationId: number,
    status: ReservationStatus
  ) {
    try {
      await apiPatch(`/reservations/${reservationId}`, { status });
      await loadTrips();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur";
      alert(message);
    }
  }

  async function cancelTrip(tripId: number) {
    // suppression immédiate de l'écran
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
  
    try {
      await apiPatch(`/trips/${tripId}`, { status: "CANCELLED" });
    } catch{
      
    }
  }

  async function editTrip(trip: Trip) {
    if (trip.status === "CANCELLED") {
      return;
    }

    const departure = prompt("Nouveau départ :", trip.departure);
    if (!departure) return;

    const destination = prompt("Nouvelle destination :", trip.destination);
    if (!destination) return;

    try {
      await apiPatch(`/trips/${trip.id}`, {
        departure,
        destination,
      });
      await loadTrips();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  }

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const visibleTrips = trips.filter((trip) => trip.status !== "CANCELLED");

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Mes trajets</h1>
        <p>Consultez, modifiez ou annulez les trajets que vous avez publiés.</p>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="errorMessage">{error}</p>}

      {!loading && !error && visibleTrips.length === 0 && (
        <p>Aucun trajet trouvé.</p>
      )}

      {!loading &&
        !error &&
        visibleTrips.map((trip) => {
          const visibleReservations = trip.reservations.filter(
            (reservation) => reservation.status !== "CANCELLED"
          );

          return (
            <div key={trip.id} className="resultCard">
              <h3>
                {trip.departure} → {trip.destination}
              </h3>
              <p>Date : {new Date(trip.date).toLocaleDateString("fr-CA")}</p>
              <p>Places restantes : {trip.availableSeats}</p>
              <p>Places totales : {trip.seats}</p>
              <p>Statut : {trip.status || "ACTIVE"}</p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "14px",
                  flexWrap: "wrap",
                }}
              >
                <button className="btnPrimary" onClick={() => editTrip(trip)}>
                  Modifier
                </button>

                <button
                  className="btnSecondary"
                  onClick={() => cancelTrip(trip.id)}
                  disabled={trip.status === "CANCELLED"}
                >
                  {trip.status === "CANCELLED" ? "Trajet annulé" : "Annuler"}
                </button>
              </div>

              <h4>Demandes reçues</h4>

              {visibleReservations.length === 0 ? (
                <p>Aucune réservation.</p>
              ) : (
                visibleReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="resultCard"
                    style={{ marginTop: "10px" }}
                  >
                    <p>{reservation.passenger.email}</p>
                    <p>Statut : {reservation.status}</p>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        className="btnPrimary"
                        onClick={() =>
                          updateReservation(reservation.id, "ACCEPTED")
                        }
                        disabled={reservation.status === "ACCEPTED"}
                      >
                        Accepter
                      </button>

                      <button
                        className="btnSecondary"
                        onClick={() =>
                          updateReservation(reservation.id, "REFUSED")
                        }
                        disabled={reservation.status === "REFUSED"}
                      >
                        Refuser
                      </button>

                      <button
                        className="btnSecondary"
                        onClick={() =>
                          updateReservation(reservation.id, "CANCELLED")
                        }
                        disabled={reservation.status === "CANCELLED"}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
    </main>
  );
}