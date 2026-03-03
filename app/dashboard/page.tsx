import Link from "next/link";

export default function DashboardPage() {
 
  const stats = {
    tripsCreated: 2,
    reservations: 3,
    pending: 1,
  };

  return (
    <div className="container">
      <div className="dashboardTop">
        <div>
          <h1 style={{ margin: "8px 0" }}>Dashboard</h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Vue rapide de votre activité (version Sprint 1).
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/register" className="btnSecondary">Créer profil</Link>
          <Link href="/login" className="btnSecondary">Connexion</Link>
        </div>
      </div>

      <div className="kpiGrid">
        <div className="kpi">
          <div className="num">{stats.tripsCreated}</div>
          <div className="lbl">Trajets proposés</div>
        </div>
        <div className="kpi">
          <div className="num">{stats.reservations}</div>
          <div className="lbl">Réservations</div>
        </div>
        <div className="kpi">
          <div className="num">{stats.pending}</div>
          <div className="lbl">En attente</div>
        </div>
      </div>

      <div className="actionsGrid">
        <div className="actionCard">
          <h3 style={{ margin: 0 }}>Proposer un trajet</h3>
          <p>Créez un trajet (départ, arrivée, date, places).</p>
          <Link href="#" className="btnPrimary">Créer un trajet</Link>
          
        </div>

        <div className="actionCard">
          <h3 style={{ margin: 0 }}>Rechercher un trajet</h3>
          <p>Trouvez un trajet disponible et faites une réservation.</p>
          <Link href="#" className="btnPrimary">Rechercher</Link>
         
        </div>
      </div>

      
    </div>
  );
}