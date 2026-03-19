"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-client";

function sanitizeCollegeId(raw: string) {
  return raw.replace(/\D/g, "");
}

function isValidCollegeId(id: string) {
  return /^\d{7}$/.test(id);
}

export default function RegisterPage() {
  const router = useRouter();

  const existingUser =
    typeof window !== "undefined" ? getCurrentUser() : null;

  if (existingUser) {
    router.push("/dashboard");
  }

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
    password.trim().length >= 6 &&
    confirmPassword.trim().length >= 6 &&
    password === confirmPassword;

  async function handleRegister() {
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
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'inscription"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="authLayout">
      <div className="authLeft">
        <Link href="/" className="authBrand">
          Covoiturage
        </Link>

        <h1>Créer un compte</h1>
        <p className="authSubtitle">
          Inscrivez-vous avec votre ID collège pour accéder à la plateforme de
          covoiturage.
        </p>

      </div>

      <div className="authRight">
        <div className="authCard">
          <div className="authCardHeader">
            <h2>Créer un profil</h2>
          </div>

          <div className="form">
            <label>ID collège</label>
            <input
              type="text"
              value={collegeId}
              onChange={(e) => setCollegeId(sanitizeCollegeId(e.target.value))}
              placeholder="Ex: 2736164"
            />

            <label>Email</label>
            <input
              type="text"
              value={generatedEmail}
              readOnly
              placeholder="Ex: 2736164@collegelacite.ca"
            />

            <label>Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
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
              type="button"
              disabled={!canRegister || loading}
              onClick={handleRegister}
            >
              {loading ? "Création..." : "Créer un compte"}
            </button>

            <div className="authAlt">
              <span>Déjà un compte ?</span>
              <Link href="/login" className="btnSecondary">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}