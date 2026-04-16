"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiPatch } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth-client";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [userChecked, setUserChecked] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    setUserChecked(true);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await apiPatch("/profile/password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setSuccess(data.message || "Mot de passe modifié avec succès");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la modification du mot de passe"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!userChecked) {
    return (
      <main className="pageContainer">
        <div className="pageHeader">
          <h1>Changer le mot de passe</h1>
          <p>Chargement...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Changer le mot de passe</h1>
        <p>Mettez à jour votre mot de passe en toute sécurité.</p>
      </div>

      <div className="authCard" style={{ maxWidth: "520px", margin: "0 auto" }}>
        <form className="form" onSubmit={handleSubmit}>
          <label>Mot de passe actuel</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Entrez votre mot de passe actuel"
          />

          <label>Nouveau mot de passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Entrez le nouveau mot de passe"
          />

          <label>Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmez le nouveau mot de passe"
          />

          {error && <p className="errorMessage">{error}</p>}
          {success && <p className="successMessage">{success}</p>}

          <button className="btnPrimary" type="submit" disabled={loading}>
            {loading ? "Modification..." : "Changer le mot de passe"}
          </button>
        </form>
      </div>
    </main>
  );
}