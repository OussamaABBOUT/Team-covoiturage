import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = verifyToken(req);
    const { tripId } = await req.json();

    if (!tripId) {
      return NextResponse.json(
        { error: "Le champ tripId est obligatoire" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: { id: Number(tripId) },
      select: {
        id: true,
        driverId: true,
        availableSeats: true,
      },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Trajet introuvable" },
        { status: 404 }
      );
    }

    if (trip.driverId === user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas réserver votre propre trajet" },
        { status: 400 }
      );
    }

    if (trip.availableSeats <= 0) {
      return NextResponse.json(
        { error: "Aucune place disponible" },
        { status: 400 }
      );
    }

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        tripId: Number(tripId),
        passengerId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: "Vous avez déjà réservé ce trajet" },
        { status: 409 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        tripId: Number(tripId),
        passengerId: user.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "Demande de réservation envoyée avec succès",
        reservation,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la réservation" },
      { status: 500 }
    );
  }
}