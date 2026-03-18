"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type DriverTrip = {
  id: number;
  departure: string;
  destination: string;
  date: string;
};

type PassengerReservation = {
  id: number;
  status: string;
  trip: {
    departure: string;
    destination: string;
    date: string;
  };
};

type HistoryResponse = {
  driverTrips: DriverTrip[];
  passengerReservations: PassengerReservation[];
};

export default function HistoryPage() {
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistory() {
      try {
        const result = await apiGet("/history");
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur");
      }
    }

    loadHistory();
  }, []);

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Historique</h1>
        <p>Consultez vos trajets passés comme conducteur ou passager.</p>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      {!data ? (
        <p>Chargement...</p>
      ) : (
        <>
          <section className="historySection">
            <h2>Trajets créés</h2>
            {data.driverTrips.length === 0 ? (
              <p>Aucun trajet créé.</p>
            ) : (
              data.driverTrips.map((trip) => (
                <div key={trip.id} className="resultCard">
                  <h3>
                    {trip.departure} → {trip.destination}
                  </h3>
                  <p>{new Date(trip.date).toLocaleString()}</p>
                </div>
              ))
            )}
          </section>

          <section className="historySection">
            <h2>Réservations effectuées</h2>
            {data.passengerReservations.length === 0 ? (
              <p>Aucune réservation trouvée.</p>
            ) : (
              data.passengerReservations.map((reservation) => (
                <div key={reservation.id} className="resultCard">
                  <h3>
                    {reservation.trip.departure} → {reservation.trip.destination}
                  </h3>
                  <p>{new Date(reservation.trip.date).toLocaleString()}</p>
                  <p>Statut : {reservation.status}</p>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </main>
  );
}