"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-client";

type Reservation = {
  id: number;
  status: "PENDING" | "ACCEPTED" | "REFUSED" | "CANCELLED";
  createdAt: string;
  trip: {
    id: number;
    departure: string;
    destination: string;
    date: string;
  };
};

export default function MyReservationsPage() {
  const router = useRouter();

  const [userChecked, setUserChecked] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //  useEffect corrigé
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

        const data = await apiGet("/my-reservations");

        // 🔥 cacher les réservations annulées
        const filtered = Array.isArray(data)
          ? data.filter((r) => r.status !== "CANCELLED")
          : [];

        setReservations(filtered);
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

    init();
  }, [router]);

  async function handleCancel(reservationId: number) {
    const confirmCancel = confirm(
      "Voulez-vous vraiment annuler cette réservation ?"
    );

    if (!confirmCancel) return;

    try {
      await apiPatch(`/reservations/${reservationId}`, {
        status: "CANCELLED",
      });

      // ✅ suppression directe visuelle
      setReservations((prev) =>
        prev.filter((r) => r.id !== reservationId)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'annulation"
      );
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "ACCEPTED":
        return "#22c55e"; // vert
      case "REFUSED":
        return "#ef4444"; // rouge
      case "PENDING":
        return "#f59e0b"; // orange
      default:
        return "#6b7280"; // gris
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
        <h1>Mes réservations</h1>
        <p>Suivez l’état de vos demandes de réservation.</p>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      <section className="listSection">
        {loading ? (
          <p>Chargement des réservations...</p>
        ) : reservations.length === 0 ? (
          <p>Aucune réservation trouvée.</p>
        ) : (
          <div className="cardGrid">
            {reservations.map((r) => (
              <div key={r.id} className="dashboardCard">
                <h2>
                  {r.trip.departure} → {r.trip.destination}
                </h2>

                <p>
                  <strong>Date :</strong>{" "}
                  {new Date(r.trip.date).toLocaleDateString("fr-CA")}
                </p>

                <p>
                  <strong>Demandée le :</strong>{" "}
                  {new Date(r.createdAt).toLocaleDateString("fr-CA")}
                </p>

                {/*  badge statut */}
                <p>
                  <strong>Statut :</strong>{" "}
                  <span
                    style={{
                      color: getStatusColor(r.status),
                      fontWeight: "bold",
                    }}
                  >
                    {r.status}
                  </span>
                </p>

                {/*  bouton annuler */}
                {r.status === "PENDING" && (
                  <button
                    className="btnSecondary"
                    onClick={() => handleCancel(r.id)}
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