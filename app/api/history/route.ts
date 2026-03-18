import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = verifyToken(req);

    const driverTrips = await prisma.trip.findMany({
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

    const passengerReservations = await prisma.reservation.findMany({
      where: {
        passengerId: user.id,
      },
      include: {
        trip: {
          include: {
            driver: {
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
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      driverTrips,
      passengerReservations,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'historique" },
      { status: 500 }
    );
  }
}