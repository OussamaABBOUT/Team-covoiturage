import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = verifyToken(req);

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        collegeId: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = verifyToken(req);
    const body = await req.json();

    const { password, role } = body;

    const dataToUpdate: {
      role?: "PASSAGER" | "CONDUCTEUR" | "ADMIN";
      passwordHash?: string;
    } = {};

    if (role) {
      if (!["PASSAGER", "CONDUCTEUR", "ADMIN"].includes(role)) {
        return NextResponse.json(
          { error: "Rôle invalide" },
          { status: 400 }
        );
      }

      dataToUpdate.role = role;
    }

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Mot de passe trop court (min 6)" },
          { status: 400 }
        );
      }

      const bcrypt = await import("bcrypt");
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
      select: {
        id: true,
        collegeId: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      message: "Profil mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}