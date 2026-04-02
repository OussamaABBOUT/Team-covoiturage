"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession, useAuthUser } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const user = useAuthUser();

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <nav className="nav">
      <div className="navLeft">
        <Link href="/" className="navBrand">
          Covoit<span className="navBrandAccent">Go</span>
        </Link>
      </div>

      <div className="navRight">
        <Link href="/" className="navLink">
          Accueil
        </Link>

        <Link href="/trips" className="navLink">
          Trajets
        </Link>

        {!user ? (
          <>
            <Link href="/login" className="btnSecondary">
              Se connecter
            </Link>
            <Link href="/register" className="btnPrimary">
              Créer un compte
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="btnSecondary">
              Dashboard
            </Link>
            <button className="btnPrimary" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}