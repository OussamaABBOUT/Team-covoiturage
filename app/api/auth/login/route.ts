import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

function sanitizeCollegeId(raw: string) {
  return raw.replace(/\D/g, "");
}

export async function POST(req: Request) {
  try {
    const { collegeId, password } = await req.json();
    const cleanId = sanitizeCollegeId(collegeId || "");

    if (!/^\d{7}$/.test(cleanId)) {
      return NextResponse.json(
        { error: "ID collège invalide" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { collegeId: cleanId },
      select: {
        id: true,
        email: true,
        role: true,
        passwordHash: true,
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Compte introuvable" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Compte désactivé" },
        { status: 403 }
      );
    }

    const ok = await bcrypt.compare(password || "", user.passwordHash);

    if (!ok) {
      return NextResponse.json(
        { error: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Connexion OK",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}