import Link from "next/link";

export default function HomePage() {

  // Page d’accueil :  

  return (
    <div className="container">
      <section className="hero">
        <div className="heroLeft">
          <h1>Le covoiturage simple, rapide et étudiant-friendly.</h1>
          <p>
            Trouvez un trajet, proposez le vôtre et réservez en quelques clics.
            Une interface claire, sans pages inutiles.
          </p>
           {/* Section principal */}
          <div className="heroActions">
            <Link href="/register" className="btnPrimary">Créer un profil</Link>
            <Link href="/login" className="btnSecondary">Se connecter</Link>
            <Link href="/dashboard" className="btnSecondary">Dashboard</Link>
          </div>
             
             {/* Section carte */}
          <div className="section">
            <div className="card">
              <h3>Recherche rapide</h3>
              <p>Filtres simples : départ, arrivée, date.</p>
            </div>
            <div className="card">
              <h3>Réservation claire</h3>
              <p>Statut : en attente, acceptée ou refusée.</p>
            </div>
            <div className="card">
              <h3>Confiance</h3>
              <p>Accès sécurisé et rôles utilisateur.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}