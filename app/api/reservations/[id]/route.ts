import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const user = verifyToken(req);
    const { id } = await params;
    const reservationId = Number(id);
    const { status } = await req.json();

    if (Number.isNaN(reservationId)) {
      return NextResponse.json(
        { error: "ID de réservation invalide" },
        { status: 400 }
      );
    }

    if (!["ACCEPTED", "REFUSED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        trip: {
          select: {
            id: true,
            driverId: true,
            availableSeats: true,
          },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    const isDriver = reservation.trip.driverId === user.id;
    const isPassenger = reservation.passengerId === user.id;
    const isAdmin = user.role === "ADMIN";

    if (!isDriver && !isPassenger && !isAdmin) {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    if (isPassenger && status !== "CANCELLED" && !isAdmin) {
      return NextResponse.json(
        { error: "Le passager peut seulement annuler" },
        { status: 403 }
      );
    }

    if (
      isDriver &&
      !["ACCEPTED", "REFUSED", "CANCELLED"].includes(status) &&
      !isAdmin
    ) {
      return NextResponse.json(
        { error: "Le conducteur peut accepter, refuser ou annuler" },
        { status: 403 }
      );
    }

    if (reservation.status === status) {
      return NextResponse.json({
        message: "Déjà dans cet état",
        reservation,
      });
    }

    if (status === "ACCEPTED" && reservation.trip.availableSeats <= 0) {
      return NextResponse.json(
        { error: "Plus de places disponibles" },
        { status: 400 }
      );
    }

    const updatedReservation = await prisma.$transaction(async (tx) => {
      const updated = await tx.reservation.update({
        where: { id: reservationId },
        data: { status },
      });

      if (reservation.status === "PENDING" && status === "ACCEPTED") {
        await tx.trip.update({
          where: { id: reservation.trip.id },
          data: { availableSeats: { decrement: 1 } },
        });
      }

      if (
        reservation.status === "ACCEPTED" &&
        (status === "REFUSED" || status === "CANCELLED")
      ) {
        await tx.trip.update({
          where: { id: reservation.trip.id },
          data: { availableSeats: { increment: 1 } },
        });
      }

      return updated;
    });

    return NextResponse.json({
      message: "Réservation mise à jour",
      reservation: updatedReservation,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la réservation" },
      { status: 500 }
    );
  }
}