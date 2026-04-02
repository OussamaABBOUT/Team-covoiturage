  "use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { saveSession } from "@/lib/auth-client";

function sanitizeCollegeId(raw: string) {
  return raw.replace(/\D/g, "");
}

export default function LoginPage() {
  const router = useRouter();

  const [collegeId, setCollegeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiPost("/auth/login", {
        collegeId: sanitizeCollegeId(collegeId),
        password,
      });

      saveSession(data.token, data.user);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
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

        <h1>Accédez à votre espace</h1>
        <p className="authSubtitle">
          Connectez-vous pour gérer vos trajets, vos réservations et votre
          historique sur la plateforme de covoiturage.
        </p>

        <div className="authInfo">
          <div className="infoRow">
            <span className="dot" />
            <div>
              <strong>Réservation rapide</strong>
              <p>Trouvez ou proposez un trajet en quelques secondes.</p>
            </div>
          </div>

          <div className="infoRow">
            <span className="dot" />
            <div>
              <strong>Suivi simplifié</strong>
              <p>Consultez vos trajets et réservations depuis votre dashboard.</p>
            </div>
          </div>

          <div className="infoRow">
            <span className="dot" />
            <div>
              <strong>Expérience moderne</strong>
              <p>Une interface simple, claire et pensée pour aller vite.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="authRight">
        <div className="authCard">
          <div className="authCardHeader">
            <h2>Connexion</h2>
            <p>Entrez vos informations pour continuer.</p>
          </div>

          <form className="form" onSubmit={handleLogin}>
            <label>ID collège</label>
            <input
              type="text"
              placeholder="Ex: 2736164"
              value={collegeId}
              onChange={(e) => setCollegeId(sanitizeCollegeId(e.target.value))}
            />

            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="errorMessage">{error}</p>}

            <button className="btnPrimary" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="authAlt">
            <span>Pas encore de compte ?</span>
            <Link href="/register" className="navLink">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}