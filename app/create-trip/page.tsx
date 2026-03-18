"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

export default function CreateTripPage() {
  const router = useRouter();

  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState(1);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await apiPost("/trips", {
        departure,
        destination,
        date,
        seats,
      });

      setSuccess("Trajet créé avec succès.");

      setTimeout(() => {
        router.push("/my-trips");
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création du trajet"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Proposer un trajet</h1>
        <p>Publiez un trajet pour permettre à d’autres utilisateurs de réserver.</p>
      </div>

      <div className="formCard">
        <form onSubmit={handleSubmit} className="form">
          <label>Lieu de départ</label>
          <input
            type="text"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            placeholder="Ex: Ottawa"
          />

          <label>Lieu d’arrivée</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Ex: Campus La Cité"
          />

          <label>Date et heure</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label>Places disponibles</label>
          <input
            type="number"
            min="1"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
          />

          {error && <p className="errorMessage">{error}</p>}
          {success && <p className="successMessage">{success}</p>}

          <button className="btnPrimary" type="submit" disabled={loading}>
            {loading ? "Création..." : "Publier le trajet"}
          </button>
        </form>
      </div>
    </main>
  );
}