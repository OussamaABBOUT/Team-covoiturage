"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-client";

type Trip = {
  id: number;
  departure: string;
  destination: string;
  date: string;
  seats: number;
  availableSeats: number;
  status?: "ACTIVE" | "CANCELLED";
};

export default function MyTripsPage() {
  const router = useRouter();

  const [userChecked, setUserChecked] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ useEffect corrigé (pas de warning)
  useEffect(() => {
    async function init() {
      const user = getCurrentUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      if (user.role !== "CONDUCTEUR" && user.role !== "ADMIN") {
        router.replace("/dashboard");
        return;
      }

      setUserChecked(true);

      try {
        setLoading(true);
        setError("");

        const data = await apiGet("/my-trips");

        // 🔥 IMPORTANT : cacher les trajets annulés
        const filtered = Array.isArray(data)
          ? data.filter((t) => t.status !== "CANCELLED")
          : [];

        setTrips(filtered);
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

  async function handleCancel(tripId: number) {
    const confirmDelete = confirm(
      "Voulez-vous vraiment annuler ce trajet ?"
    );

    if (!confirmDelete) return;

    try {
      await apiPatch(`/trips/${tripId}`, {
        status: "CANCELLED",
      });

      // ✅ suppression directe du UI
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'annulation"
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
        <h1>Mes trajets</h1>
        <p>Gérez vos trajets publiés et suivez leur état.</p>
      </div>

      {error && <p className="errorMessage">{error}</p>}

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
                  <strong>Places restantes :</strong> {trip.availableSeats}
                </p>

                {/* ✅ Badge statut */}
                <p>
                  <strong>Statut :</strong>{" "}
                  <span
                    style={{
                      color:
                        trip.availableSeats === 0 ? "#ff3b4d" : "#22c55e",
                      fontWeight: "bold",
                    }}
                  >
                    {trip.availableSeats === 0 ? "Complet" : "Disponible"}
                  </span>
                </p>

                <button
                  className="btnSecondary"
                  onClick={() => handleCancel(trip.id)}
                >
                  Annuler le trajet
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}