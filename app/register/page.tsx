"use client";

import { useMemo, useState } from "react";


 // verifier les champs si ils sont valides .
function sanitizeCollegeId(raw: string) {
  return raw.replace(/\D/g, "");
}

function isValidCollegeId(id: string) {
  return /^\d{7}$/.test(id);
}

export default function RegisterPage() {
  const [collegeId, setCollegeId] = useState("");
  const [role, setRole] = useState("");

  const cleanId = sanitizeCollegeId(collegeId);

  const generatedEmail = useMemo(() => {
    if (!isValidCollegeId(cleanId)) return "";
    return `${cleanId}@collegelacite.ca`;
  }, [cleanId]);

  const isFormValid = isValidCollegeId(cleanId) && role;

  return (
    <section className="auth">
      <h2>Créer un profil</h2>

      <div className="form">
        <label>ID collège </label>
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
          placeholder="Ex: 2736058@collegelacite.ca"
        />

        <label>Rôle</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">-- Choisir un rôle --</option>
          <option value="PASSAGER">Passager</option>
          <option value="CONDUCTEUR">Conducteur</option>
          <option value="ADMIN">Administrateur</option>
        </select>

        <label>Mot de passe</label>
        <input type="password" placeholder="••••••••" />

        <button
          className="btnPrimary"
          type="button"
          disabled={!isFormValid}
          onClick={() => window.location.href = "/login"}
        >
          Créer mon compte
        </button>
      </div>
    </section>
  );
}