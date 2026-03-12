"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// Nettoie l’ID : conserve uniquement les chiffres
function sanitizeCollegeId(raw: string) {
  return raw.replace(/\D/g, "");
}

// Validation de l' ID collège, doit avoir exactement 7 chiffres
function isValidCollegeId(id: string) {
  return /^\d{7}$/.test(id);
}

// 
export default function RegisterPage() {
  const [collegeId, setCollegeId] = useState("");
  const [role, setRole] = useState("");

  const cleanId = sanitizeCollegeId(collegeId);

  // Génère automatiquement l’email à partir de l’ID 
  const generatedEmail = useMemo(() => {
    if (!isValidCollegeId(cleanId)) return "";
    return `${cleanId}@collegelacite.ca`;
  }, [cleanId]);

  // Verifié si l' ID est valide pour autorisé le bouton
  const isFormValid = isValidCollegeId(cleanId) && role;

  return (
    <div className="signupLayout">
      
      <div className="signupLeft">
        <Link href="/" className="signupBrand">
          Covoiturage
        </Link>

        <h1>Rejoignez la plateforme de covoiturage.</h1>
        <p className="signupSubtitle">
          Créez votre profil en quelques secondes avec votre ID collège, puis commencez à
          proposer ou réserver des trajets.
        </p>

        <div className="signupSteps">
          <div className="step">
            <div className="stepNum">1</div>
            <div>
              <h3>Inscription</h3>
              <p>Entrez votre ID collège et choisissez votre rôle.</p>
            </div>
          </div>

          <div className="step">
            <div className="stepNum">2</div>
            <div>
              <h3>Vérification</h3>
              <p>Votre compte est validé selon les règles de la plateforme.</p>
            </div>
          </div>

          <div className="step">
            <div className="stepNum">3</div>
            <div>
              <h3>Démarrage</h3>
              <p>Accédez au dashboard et utilisez les fonctionnalités.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT (form card) */}
      <div className="signupRight">
        <div className="signupCard">
          <div className="signupCardHeader">
            <h2>Créer un profil</h2>
            
          </div>

          <div className="form">
            <label>ID collège</label>
            <input
              type="text"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              placeholder="Ex: 2736164"
            />

            <label>Email généré</label>
            <input
              type="text"
              value={generatedEmail}
              readOnly
              placeholder="Ex: 2736164@collegelacite.ca"
            />

            <label>Rôle</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">-- Choisir un rôle --</option>
              <option value="PASSAGER">Passager</option>
              <option value="CONDUCTEUR">Conducteur</option>
              <option value="ADMIN">Administrateur</option>
            </select>

            <label>Mot de passe</label>
            <input type="password" placeholder="••••••••" />

        {/*  redirection vers la page de connexion */}

            <button
              className="btnPrimary"
              type="button"
              disabled={!isFormValid}
              onClick={() => (window.location.href = "/login")}
            >
              S’inscrire
            </button>

            <p className="signupTerms">
              En vous inscrivant, vous acceptez les conditions d’utilisation de la plateforme.
            </p>

            <div className="signupAlt">
              <span>Déjà un compte ?</span>
              <Link href="/login" className="btnSecondary">Se connecter</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}