import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const user = verifyToken(req);

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        role: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    if (existingUser.role !== "PASSAGER" && existingUser.role !== "CONDUCTEUR") {
      return NextResponse.json(
        { error: "Seuls les passagers et conducteurs peuvent changer de rôle" },
        { status: 403 }
      );
    }

    const newRole =
      existingUser.role === "PASSAGER" ? "CONDUCTEUR" : "PASSAGER";

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: newRole,
      },
      select: {
        role: true,
      },
    });

    return NextResponse.json({
      message: "Rôle mis à jour avec succès",
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Erreur API /profile/role :", error);

    return NextResponse.json(
      { error: "Erreur lors du changement de rôle" },
      { status: 500 }
    );
  }
}