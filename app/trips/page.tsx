"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-client";

type Trip = {
  id: number;
  departure: string;
  destination: string;
  date: string;
  seats: number;
  availableSeats: number;
  driver?: {
    id: number;
    email: string;
    role: string;
  };
};

export default function TripsPage() {
  const router = useRouter();

  const [userChecked, setUserChecked] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  // ✅ CORRECTION DU useEffect (plus de warning)
  useEffect(() => {
    async function init() {
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

      try {
        setLoading(true);
        setError("");

        const data = await apiGet("/trips");
        setTrips(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des trajets"
        );
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [router]);

  async function loadTrips() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (departure.trim()) params.append("departure", departure.trim());
      if (destination.trim()) params.append("destination", destination.trim());
      if (date) params.append("date", date);

      const endpoint = params.toString()
        ? `/trips?${params.toString()}`
        : "/trips";

      const data = await apiGet(endpoint);

      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des trajets"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    await loadTrips();
  }

  async function handleReserve(tripId: number) {
    try {
      setError("");
      await apiPost("/reservations", { tripId });

      alert("Réservation envoyée avec succès.");
      router.push("/my-reservations");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la réservation"
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

  return (
    <main className="page">
      <div className="pageHeader">
        <h1>Rechercher un trajet</h1>
        <p>Trouvez un trajet disponible et envoyez une réservation.</p>
      </div>

      {/* 🔍 FORMULAIRE */}
      <form onSubmit={handleSearch} className="formCard">
        <div className="formGroup">
          <label>Départ</label>
          <input
            type="text"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder="Ex: Ottawa"
          />
        </div>

        <div className="formGroup">
          <label>Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Ex: Montréal"
          />
        </div>

        <div className="formGroup">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button type="submit" className="btnPrimary" disabled={loading}>
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </form>

      {error && <p className="errorMessage">{error}</p>}

      {/* 📋 LISTE */}
      <section className="listSection">
        {loading ? (
          <p>Chargement des trajets...</p>
        ) : trips.length === 0 ? (
          <p>Aucun trajet trouvé.</p>
        ) : (
          <div className="cardGrid">
            {trips.map((trip) => (
              <div key={trip.id} className="dashboardCard">
                <h2>
                  {trip.departure} → {trip.destination}
                </h2>

                <p>
                  <strong>Date :</strong>{" "}
                  {new Date(trip.date).toLocaleDateString("fr-CA")}
                </p>

                <p>
                  <strong>Places totales :</strong> {trip.seats}
                </p>

                <p>
                  <strong>Places disponibles :</strong> {trip.availableSeats}
                </p>

                {trip.driver?.email && (
                  <p>
                    <strong>Conducteur :</strong> {trip.driver.email}
                  </p>
                )}

                {/* ✅ BOUTON AMÉLIORÉ */}
                <button
                  className={
                    trip.availableSeats <= 0 ? "btnSecondary" : "btnPrimary"
                  }
                  onClick={() => handleReserve(trip.id)}
                  disabled={trip.availableSeats <= 0}
                >
                  {trip.availableSeats <= 0 ? "Complet" : "Réserver"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}