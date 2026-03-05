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
          <h1>Dashboard</h1>
          <p>
            Vue rapide de votre activité 
          </p>
        </div>

        <div>
          <Link href="/register" className="btnSecondary">Créer profil</Link>
          <Link href="/login" className="btnSecondary">Connexion</Link>
        </div>
      </div>

      <div className="kpiGrid">
        <div className="kpi">
          <div className="num">{stats.tripsCreated}</div>
          <div className="label">Trajets proposés</div>
        </div>
        <div className="kpi">
          <div className="num">{stats.reservations}</div>
          <div className="label">Réservations</div>
        </div>
        <div className="kpi">
          <div className="num">{stats.pending}</div>
          <div className="label">En attente</div>
        </div>
      </div>

      <div className="actionsGrid">
        <div className="actionCard">
          <h3>Proposer un trajet</h3>
          <p>Créez un trajet (départ, arrivée, date, places).</p>
          <Link href="#" className="btnPrimary">Créer un trajet</Link>
          
        </div>

        <div className="actionCard">
          <h3>Rechercher un trajet</h3>
          <p>Trouvez un trajet disponible et faites une réservation.</p>
          <Link href="#" className="btnPrimary">Rechercher</Link>
         
        </div>
      </div>

      
    </div>
  );
}