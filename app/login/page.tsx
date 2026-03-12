"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// Nettoie l’ID : conserve uniquement les chiffres
function sanitizeCollegeId(raw: string) {
  return raw.replace(/\D/g, "");
}

// Validation de l' ID collège, doit avoir exactement 7 chiffres
function isValidCollegeId(id: string) {
  return /^\d{7}$/.test(id);
}

export default function LoginPage() {
  const [collegeId, setCollegeId] = useState("");
  const [password, setPassword] = useState("");

  const cleanId = sanitizeCollegeId(collegeId);

  // Génère automatiquement l’email à partir de l’ID 
  const generatedEmail = useMemo(() => {
    if (!isValidCollegeId(cleanId)) return "";
    return `${cleanId}@collegelacite.ca`;
  }, [cleanId]);

  // Verifié si l' ID et le mot de passe sont valide
  const canLogin = isValidCollegeId(cleanId) && password.trim().length >= 4;

  return (
    <div className="authLayout">
      
      <div className="authLeft">
        <Link href="/" className="authBrand">
          Covoiturage
        </Link>

        <h1>Connexion</h1>
        <p className="authSubtitle">
          Accédez à votre dashboard et gérez vos trajets. Entrez votre ID collège
          et votre mot de passe.
        </p>

        <div className="authInfo">
          <div className="infoRow">
            <span className="dot" />
            Email généré automatiquement : <b>ID@collegelacite.ca</b>
          </div>
          <div className="infoRow">
            <span className="dot" />
            Accès sécurisé et rôles utilisateur
          </div>
          <div className="infoRow">
            <span className="dot" />
            Interface simple, pensée pour la démo
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="authRight">
        <div className="authCard">
          <div className="authCardHeader">
            <h2>Se connecter</h2>
            
          </div>

          <div className="form">
            <label>ID collège </label>
            <input
              type="text"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              placeholder="Ex: 2736164"
            />

            <label>Email </label>
            <input
              type="text"
              value={generatedEmail}
              readOnly
              placeholder="Ex: 2736164@collegelacite.ca"
            />

            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <button
              className="btnPrimary"
              type="button"
              disabled={!canLogin}
              onClick={() => (window.location.href = "/dashboard")}
            >
              Se connecter
            </button>

            <div className="authAlt">
              <span>Pas encore de compte ?</span>
              <Link href="/register" className="btnSecondary">
                Créer un profil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}