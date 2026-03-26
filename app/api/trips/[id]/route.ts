import { NextResponse } from "next/server";
import { ReservationStatus, TripStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const user = verifyToken(req);
    const { id } = await params;
    const tripId = Number(id);
    const body = await req.json();

    if (Number.isNaN(tripId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    // si le trajet n'existe plus ou n'est pas trouvé, on ne casse pas l'UI
    if (!trip) {
      return NextResponse.json({ success: true });
    }

    if (trip.driverId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    
    if (trip.status === TripStatus.CANCELLED) {
      return NextResponse.json({ success: true });
    }

    if (body.status === "CANCELLED") {
      await prisma.reservation.updateMany({
        where: {
          tripId,
          status: {
            in: [ReservationStatus.PENDING, ReservationStatus.ACCEPTED],
          },
        },
        data: {
          status: ReservationStatus.CANCELLED,
        },
      });

      await prisma.trip.update({
        where: { id: tripId },
        data: {
          status: TripStatus.CANCELLED,
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}