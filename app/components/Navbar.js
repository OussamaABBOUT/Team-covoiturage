import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="logo">Covoiturage</Link>

      <div className="navLinks">
        <Link href="/">Accueil</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/login">Connexion</Link>
        <Link href="/register" className="btn">Créer un profil</Link>
      </div>
    </nav>
  );
}