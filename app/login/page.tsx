"use client";

import { useMemo, useState } from "react";

function sanitizeCollegeId(raw: string) {
  return raw.replace(/\D/g, "");
}

function isValidCollegeId(id: string) {
  return /^\d{7}$/.test(id);
}

export default function LoginPage() {
  const [collegeId, setCollegeId] = useState("");
  const [password, setPassword] = useState("");

  const cleanId = sanitizeCollegeId(collegeId);

  const generatedEmail = useMemo(() => {
    if (!isValidCollegeId(cleanId)) return "";
    return `${cleanId}@collegelacite.ca`;
  }, [cleanId]);

  const canLogin = isValidCollegeId(cleanId) && password.trim().length >= 4;

  return (
    <section className="auth">
      <h2>Connexion</h2>

      <div className="form">
      <label>ID collège</label>
        <input
          type="text"
          value={collegeId}
          onChange={(e) => setCollegeId(e.target.value)}
          placeholder="Ex: 2736164"
        />

        <label>Email</label>
        <input
          type="text"
          value={generatedEmail}
          readOnly
          placeholder="Ex: 2736058@collegelacite.ca"
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

        <div className="card" >
          <h3>Pas encore de compte ?</h3>
          <p>
            Créez votre profil avec votre ID collège.
          </p>
          <div>
            <a className="btnSecondary" href="/register">
              Créer un profil
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}