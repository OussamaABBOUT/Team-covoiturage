import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = verifyToken(req);

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        collegeId: true,
        email: true,
        role: true,
        isActive: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = verifyToken(req);

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    const { userId, isActive } = await req.json();

    if (typeof userId !== "number" || typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      message: isActive
        ? "Utilisateur activé"
        : "Utilisateur désactivé",
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'utilisateur" },
      { status: 500 }
    );
  }
}