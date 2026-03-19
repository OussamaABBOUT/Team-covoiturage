import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const user = verifyToken(req);
    const tripId = Number(context.params.id);
    const body = await req.json();

    if (Number.isNaN(tripId)) {
      return NextResponse.json(
        { error: "ID trajet invalide" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Trajet introuvable" },
        { status: 404 }
      );
    }

    if (trip.driverId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    const updateData: {
      departure?: string;
      destination?: string;
      date?: Date;
      seats?: number;
      availableSeats?: number;
      status?: "ACTIVE" | "CANCELLED";
    } = {};

    if (body.departure) updateData.departure = body.departure;
    if (body.destination) updateData.destination = body.destination;
    if (body.date) updateData.date = new Date(body.date);

    if (body.seats) {
      const seatsNumber = Number(body.seats);

      if (Number.isNaN(seatsNumber) || seatsNumber <= 0) {
        return NextResponse.json(
          { error: "Nombre de places invalide" },
          { status: 400 }
        );
      }

      updateData.seats = seatsNumber;
      updateData.availableSeats = seatsNumber;
    }

    if (body.status) {
      if (!["ACTIVE", "CANCELLED"].includes(body.status)) {
        return NextResponse.json(
          { error: "Statut invalide" },
          { status: 400 }
        );
      }

      updateData.status = body.status;
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
    });

    return NextResponse.json({
      message: "Trajet mis à jour avec succès",
      trip: updatedTrip,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du trajet" },
      { status: 500 }
    );
  }
}