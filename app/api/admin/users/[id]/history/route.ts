import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, { params }: RouteContext) {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        collegeId: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    const trips = await prisma.trip.findMany({
      where: {
        driverId: userId,
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        departure: true,
        destination: true,
        date: true,
        seats: true,
        availableSeats: true,
        status: true,
      },
    });

    const reservations = await prisma.reservation.findMany({
      where: {
        passengerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        trip: {
          select: {
            id: true,
            departure: true,
            destination: true,
            date: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({
      user,
      trips,
      reservations,
    });
  } catch (error) {
    console.error("Erreur API /admin/users/[id]/history :", error);

    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'historique utilisateur" },
      { status: 500 }
    );
  }
}