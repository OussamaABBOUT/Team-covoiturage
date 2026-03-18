import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const departure = searchParams.get("departure");
    const destination = searchParams.get("destination");
    const date = searchParams.get("date");

    const whereClause: {
      departure?: {
        contains: string;
        mode: "insensitive";
      };
      destination?: {
        contains: string;
        mode: "insensitive";
      };
      date?: {
        gte: Date;
        lt: Date;
      };
    } = {};

    if (departure) {
      whereClause.departure = {
        contains: departure,
        mode: "insensitive",
      };
    }

    if (destination) {
      whereClause.destination = {
        contains: destination,
        mode: "insensitive",
      };
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      whereClause.date = {
        gte: startDate,
        lt: endDate,
      };
    }

    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        driver: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des trajets" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = verifyToken(req);

    if (user.role !== "CONDUCTEUR" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    const { departure, destination, date, seats } = await req.json();

    if (!departure || !destination || !date || !seats) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    const seatsNumber = Number(seats);

    if (Number.isNaN(seatsNumber) || seatsNumber <= 0) {
      return NextResponse.json(
        { error: "Le nombre de places doit être supérieur à 0" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.create({
      data: {
        departure,
        destination,
        date: new Date(date),
        seats: seatsNumber,
        availableSeats: seatsNumber,
        driverId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Trajet créé avec succès",
        trip,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du trajet" },
      { status: 500 }
    );
  }
}