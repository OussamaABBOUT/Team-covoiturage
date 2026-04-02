import Link from "next/link";

export default function HomePage() {
  return (
    <main className="homePage">
      <section className="heroSection">
        <div className="heroOverlay" />
        <div className="heroContent">
          <h1 className="heroTitle">
            Voyagez en covoiturage en toute simplicité
          </h1>

          <p className="heroSubtitle">
            Trouvez un trajet rapidement, partagez vos déplacements et voyagez
            dans une plateforme moderne, sécurisée et pensée pour les étudiants
            et les utilisateurs de tous les jours.
          </p>

          <div className="heroStats">
            <div className="heroStat">
              <span className="heroStatNumber">24/7</span>
              <span className="heroStatLabel">Plateforme disponible</span>
            </div>

            <div className="heroStat">
              <span className="heroStatNumber">Rapide</span>
              <span className="heroStatLabel">Réservation simplifiée</span>
            </div>

            <div className="heroStat">
              <span className="heroStatNumber">Fiable</span>
              <span className="heroStatLabel">Trajets sécurisés</span>
            </div>
          </div>

          <div className="heroActions">
            <Link href="/trips" className="btnPrimary">
              Rechercher un trajet
            </Link>

            <Link href="/register" className="btnSecondary">
              Rejoindre la plateforme
            </Link>
          </div>
        </div>
      </section>

      <section className="sectionWrap">
        <div className="sectionHeader">
          <h2 className="sectionTitle">
            Pourquoi <span className="sectionTitleAccent">nous choisir</span> ?
          </h2>
          <p className="sectionText">
            Une plateforme de covoiturage moderne, pratique et pensée pour
            rendre chaque déplacement plus simple.
          </p>
        </div>

        <div className="featuresGrid">
          <div className="featureCard">
            <div className="featureIcon">💰</div>
            <h3>Coûts réduits</h3>
            <p>
              Partagez les frais de déplacement et profitez d’une solution plus
              économique.
            </p>
          </div>

          <div className="featureCard">
            <div className="featureIcon">🚗</div>
            <h3>Trajets fiables</h3>
            <p>
              Trouvez facilement des conducteurs ou proposez vos trajets en
              quelques clics.
            </p>
          </div>

          <div className="featureCard">
            <div className="featureIcon">⚡</div>
            <h3>Réservation rapide</h3>
            <p>
              Une expérience simple pour réserver ou publier un trajet sans
              complication.
            </p>
          </div>

          <div className="featureCard">
            <div className="featureIcon">🛡️</div>
            <h3>Utilisation sécurisée</h3>
            <p>
              Une plateforme structurée avec gestion des rôles, réservations et
              suivi clair.
            </p>
          </div>
        </div>
      </section>

      <section className="sectionWrap">
        <div className="sectionHeader">
          <h2 className="sectionTitle">
            Comment ça <span className="sectionTitleAccent">fonctionne</span> ?
          </h2>
          <p className="sectionText">
            Quelques étapes simples pour profiter de la plateforme.
          </p>
        </div>

        <div className="stepsGrid">
          <div className="stepCard">
            <div className="stepNumber">1</div>
            <h3>Créer un compte</h3>
            <p>
              Inscrivez-vous et accédez à votre espace personnel selon votre
              rôle.
            </p>
          </div>

          <div className="stepCard">
            <div className="stepNumber">2</div>
            <h3>Choisir un trajet</h3>
            <p>
              Recherchez un trajet disponible ou publiez-en un si vous êtes
              conducteur.
            </p>
          </div>

          <div className="stepCard">
            <div className="stepNumber">3</div>
            <h3>Réserver</h3>
            <p>
              Envoyez votre demande de réservation directement depuis la
              plateforme.
            </p>
          </div>

          <div className="stepCard">
            <div className="stepNumber">4</div>
            <h3>Voyager sereinement</h3>
            <p>
              Suivez vos réservations, vos trajets et votre historique dans
              votre dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="sectionWrap ctaSection">
        <div className="ctaBox">
          <h2>Prêt à commencer votre prochain trajet ?</h2>
          <p>
            Connectez-vous, recherchez un trajet ou proposez-en un pour faire
            partie d’une expérience de covoiturage moderne et efficace.
          </p>

          <div className="heroActions">
            <Link href="/login" className="btnSecondary">
              Se connecter
            </Link>
            <Link href="/register" className="btnPrimary">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}