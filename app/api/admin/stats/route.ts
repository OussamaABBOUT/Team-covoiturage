import { NextResponse } from "next/server";
import { ReservationStatus, TripStatus } from "@prisma/client";
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

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalTrips,
      activeTrips,
      cancelledTrips,
      totalReservations,
      pendingReservations,
      acceptedReservations,
      refusedReservations,
      cancelledReservations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.trip.count(),
      prisma.trip.count({ where: { status: TripStatus.ACTIVE } }),
      prisma.trip.count({ where: { status: TripStatus.CANCELLED } }),
      prisma.reservation.count(),
      prisma.reservation.count({
        where: { status: ReservationStatus.PENDING },
      }),
      prisma.reservation.count({
        where: { status: ReservationStatus.ACCEPTED },
      }),
      prisma.reservation.count({
        where: { status: ReservationStatus.REFUSED },
      }),
      prisma.reservation.count({
        where: { status: ReservationStatus.CANCELLED },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalTrips,
      activeTrips,
      cancelledTrips,
      totalReservations,
      pendingReservations,
      acceptedReservations,
      refusedReservations,
      cancelledReservations,
    });
  } catch (error) {
    console.error("Erreur API /admin/stats :", error);

    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}