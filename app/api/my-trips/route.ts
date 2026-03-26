import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = verifyToken(req);

    if (user.role !== "CONDUCTEUR" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    const trips = await prisma.trip.findMany({
      where: {
        driverId: user.id,
      },
      include: {
        reservations: {
          include: {
            passenger: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("ERREUR API /api/my-trips :", error);

    return NextResponse.json(
      { error: "Erreur lors de la récupération des trajets" },
      { status: 500 }
    );
  }
}