import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

function sanitizeCollegeId(raw: string) {
  return raw.replace(/\D/g, "");
}

export async function POST(req: Request) {
  try {
    const { collegeId, role, password } = await req.json();

    const cleanId = sanitizeCollegeId(collegeId || "");
    if (!/^\d{7}$/.test(cleanId)) {
      return NextResponse.json({ error: "ID collège invalide" }, { status: 400 });
    }
    if (!["PASSAGER", "CONDUCTEUR", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Mot de passe trop court (min 6)" }, { status: 400 });
    }

    const email = `${cleanId}@collegelacite.ca`;

    const exists = await prisma.user.findFirst({
      where: { OR: [{ collegeId: cleanId }, { email }] },
      select: { id: true },
    });
    if (exists) {
      return NextResponse.json({ error: "Utilisateur déjà existant" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { collegeId: cleanId, email, role, passwordHash },
    });

    return NextResponse.json({ message: "Compte créé", email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}