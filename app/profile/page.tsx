"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import Link from "next/link";

type Profile = {
  id: number;
  collegeId: string;
  email: string;
  role: string;
  isActive: boolean;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiGet("/profile");
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur profil");
      }
    }

    loadProfile();
  }, []);

  return (
    <main className="pageContainer">
      <div className="pageHeader">
        <h1>Mon profil</h1>
        <p>Consultez les informations de votre compte.</p>
      </div>

      {error && <p className="errorMessage">{error}</p>}

      {!profile ? (
        <p>Chargement...</p>
      ) : (
        <div className="resultCard cardWithAction">
          <div className="cardContent">

          
          <p><strong>ID collège :</strong> {profile.collegeId}</p>
          <p><strong>Email :</strong> {profile.email}</p>
          <p><strong>Rôle :</strong> {profile.role}</p>
          <p><strong>Compte actif :</strong> {profile.isActive ? "Oui" : "Non"}</p>
          </div>

          <Link href="/profile/password" className="btnPrimary smallBtn">
            Changer le mot de passe
          </Link>

        </div>
      )}
        
    </main>
  );
}