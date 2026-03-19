"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPatch } from "@/lib/api";

type Reservation = {
  id: number;
  status: "PENDING" | "ACCEPTED" | "REFUSED";
  passenger: {
    id: number;
    email: string;
    role: string;
  };
};

type Trip = {
  id: number;
  departure: string;
  destination: string;
  date: string;
  availableSeats: number;
  seats: number;
  status?: "ACTIVE" | "CANCELLED";
  reservations: Reservation[];
};

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTrips() {
    try {
      setError("");
      const data = await apiGet("/my-trips");
      setTrips(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function updateReservation(
    reservationId: number,
    status: "ACCEPTED" | "REFUSED"
  ) {
    try {
      await apiPatch(`/reservations/${reservationId}`, { status });
      await loadTrips();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  }

  async function cancelTrip(tripId: number) {
    try {
      await apiPatch(`/trips/${tripId}`, { status: "CANCELLED" });
      await loadTrips();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  }

  async function editTrip(trip: Trip) {
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
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchTrips() {
      try {
        const data = await apiGet("/my-trips");

        if (isMounted) {
          setTrips(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Erreur");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchTrips();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Mes trajets</h1>
        <p>Consultez, modifiez ou annulez les trajets que vous avez publiés.</p>
      </div>

      {loading && <p>Chargement...</p>}
      {error && <p className="errorMessage">{error}</p>}

      {!loading &&
        !error &&
        trips.map((trip) => (
          <div key={trip.id} className="resultCard">
            <h3>
              {trip.departure} → {trip.destination}
            </h3>
            <p>Date : {new Date(trip.date).toLocaleString()}</p>
            <p>Places restantes : {trip.availableSeats}</p>
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
              >
                Annuler
              </button>
            </div>

            <h4>Demandes reçues</h4>

            {trip.reservations.length === 0 ? (
              <p>Aucune réservation.</p>
            ) : (
              trip.reservations.map((reservation) => (
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
                    >
                      Accepter
                    </button>

                    <button
                      className="btnSecondary"
                      onClick={() =>
                        updateReservation(reservation.id, "REFUSED")
                      }
                    >
                      Refuser
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
    </main>
  );
}