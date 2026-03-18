import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const user = verifyToken(req);
    const reservationId = Number(context.params.id);
    const { status } = await req.json();

    if (Number.isNaN(reservationId)) {
      return NextResponse.json(
        { error: "ID de réservation invalide" },
        { status: 400 }
      );
    }

    if (!["ACCEPTED", "REFUSED"].includes(status)) {
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

    if (reservation.trip.driverId !== user.id) {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    if (reservation.status === status) {
      return NextResponse.json(
        { error: "La réservation a déjà ce statut" },
        { status: 400 }
      );
    }

    if (
      status === "ACCEPTED" &&
      reservation.status !== "ACCEPTED" &&
      reservation.trip.availableSeats <= 0
    ) {
      return NextResponse.json(
        { error: "Aucune place disponible" },
        { status: 400 }
      );
    }

    const updatedReservation = await prisma.$transaction(async (tx: typeof prisma) => {
      const updated = await tx.reservation.update({
        where: { id: reservationId },
        data: {
          status,
        },
      });

      if (reservation.status === "PENDING" && status === "ACCEPTED") {
        await tx.trip.update({
          where: { id: reservation.trip.id },
          data: {
            availableSeats: {
              decrement: 1,
            },
          },
        });
      }

      if (reservation.status === "ACCEPTED" && status === "REFUSED") {
        await tx.trip.update({
          where: { id: reservation.trip.id },
          data: {
            availableSeats: {
              increment: 1,
            },
          },
        });
      }

      return updated;
    });

    return NextResponse.json({
      message:
        status === "ACCEPTED"
          ? "Réservation acceptée avec succès"
          : "Réservation refusée avec succès",
      reservation: updatedReservation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la réservation" },
      { status: 500 }
    );
  }
}