import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const admin = verifyToken(req);

    if (admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        { error: "ID utilisateur invalide" },
        { status: 400 }
      );
    }

    const { isActive } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: Boolean(isActive),
      },
      select: {
        id: true,
        collegeId: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      message: "Utilisateur mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur API /admin/users/[id] :", error);

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'utilisateur" },
      { status: 500 }
    );
  }
}