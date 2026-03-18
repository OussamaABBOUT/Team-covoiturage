"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

type Trip = {
  id: number;
  departure: string;
  destination: string;
  date: string;
  seats: number;
  availableSeats: number;
  driver: {
    id: number;
    email: string;
    role: string;
  };
};

export default function TripsPage() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTrips() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const params = new URLSearchParams();

      if (departure.trim()) {
        params.append("departure", departure.trim());
      }

      if (destination.trim()) {
        params.append("destination", destination.trim());
      }

      if (date) {
        params.append("date", date);
      }

      const query = params.toString();
      const endpoint = query ? `/trips?${query}` : "/trips";

      const data = await apiGet(endpoint);
      setTrips(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la recherche des trajets"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleReserve(tripId: number) {
    try {
      setError("");
      setSuccess("");

      await apiPost("/reservations", { tripId });
      setSuccess("Demande de réservation envoyée avec succès.");
      await loadTrips();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la réservation"
      );
    }
  }

  useEffect(() => {
    loadTrips();
  }, []);

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Rechercher un trajet</h1>
        <p>Trouvez un trajet selon le départ, la destination et la date.</p>
      </div>

      <div className="searchCard">
        <div className="formGrid">
          <div>
            <label>Départ</label>
            <input
              type="text"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              placeholder="Ex: Ottawa"
            />
          </div>

          <div>
            <label>Destination</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Ex: Campus La Cité"
            />
          </div>

          <div>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <button className="btnPrimary" onClick={loadTrips} disabled={loading}>
          {loading ? "Recherche..." : "Rechercher"}
        </button>

        {error && <p className="errorMessage">{error}</p>}
        {success && <p className="successMessage">{success}</p>}
      </div>

      <div className="resultsGrid">
        {trips.length === 0 && !loading ? (
          <div className="resultCard">
            <h3>Aucun trajet trouvé</h3>
            <p>Essayez d’élargir votre recherche.</p>
          </div>
        ) : (
          trips.map((trip) => (
            <div key={trip.id} className="resultCard">
              <h3>
                {trip.departure} → {trip.destination}
              </h3>
              <p>
                <strong>Date :</strong>{" "}
                {new Date(trip.date).toLocaleString()}
              </p>
              <p>
                <strong>Places disponibles :</strong> {trip.availableSeats}
              </p>
              <p>
                <strong>Conducteur :</strong> {trip.driver.email}
              </p>

              <button
                className="btnPrimary"
                onClick={() => handleReserve(trip.id)}
                disabled={trip.availableSeats <= 0}
              >
                {trip.availableSeats > 0 ? "Réserver" : "Complet"}
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}