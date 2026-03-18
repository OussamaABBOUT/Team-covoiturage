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

    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();
    const totalReservations = await prisma.reservation.count();

    return NextResponse.json({
      users: totalUsers,
      trips: totalTrips,
      reservations: totalReservations,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}