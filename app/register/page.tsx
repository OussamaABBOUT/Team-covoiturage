"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

function sanitizeCollegeId(raw: string) {
  return raw.replace(/\D/g, "");
}

function isValidCollegeId(id: string) {
  return /^\d{7}$/.test(id);
}

export default function RegisterPage() {
  const router = useRouter();

  const [collegeId, setCollegeId] = useState("");
  const [role, setRole] = useState("PASSAGER");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanId = sanitizeCollegeId(collegeId);

  const generatedEmail = useMemo(() => {
    if (!isValidCollegeId(cleanId)) return "";
    return `${cleanId}@collegelacite.ca`;
  }, [cleanId]);

  const canRegister =
    isValidCollegeId(cleanId) &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!canRegister) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await apiPost("/auth/register", {
        collegeId: cleanId,
        role,
        password,
      });

      setSuccess(data.message || "Compte créé avec succès");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'inscription"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="authLayout">
      <div className="authLeft">
        <Link href="/" className="authBrand">
          Covoit<span className="navBrandAccent">Go</span>
        </Link>

        <h1>Créez votre compte</h1>
        <p className="authSubtitle">
          Rejoignez la plateforme pour rechercher des trajets, publier vos
          déplacements et gérer vos réservations facilement.
        </p>

        <div className="authInfo">
          <div className="infoRow">
            <span className="dot" />
            <div>
              <strong>Inscription rapide</strong>
              <p>Créez votre profil en quelques étapes simples.</p>
            </div>
          </div>

          <div className="infoRow">
            <span className="dot" />
            <div>
              <strong>Choix du rôle</strong>
              <p>Inscrivez-vous comme passager, conducteur ou administrateur.</p>
            </div>
          </div>

          <div className="infoRow">
            <span className="dot" />
            <div>
              <strong>Accès à votre dashboard</strong>
              <p>Suivez toute votre activité depuis un espace personnel moderne.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="authRight">
        <div className="authCard">
          <div className="authCardHeader">
            <h2>Créer un profil</h2>
            <p>Remplissez les informations ci-dessous.</p>
          </div>

          <form className="form" onSubmit={handleRegister}>
            <label>ID collège</label>
            <input
              type="text"
              value={collegeId}
              onChange={(e) => setCollegeId(sanitizeCollegeId(e.target.value))}
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
              <option value="PASSAGER">Passager</option>
              <option value="CONDUCTEUR">Conducteur</option>
              <option value="ADMIN">Admin</option>
            </select>

            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
            />

            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Retapez le mot de passe"
            />

            {error && <p className="errorMessage">{error}</p>}
            {success && <p className="successMessage">{success}</p>}

            <button
              className="btnPrimary"
              type="submit"
              disabled={!canRegister || loading}
            >
              {loading ? "Création..." : "Créer un compte"}
            </button>
          </form>

          <div className="authAlt">
            <span>Vous avez déjà un compte ?</span>
            <Link href="/login" className="navLink">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}