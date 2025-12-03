import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria");
    const busqueda = searchParams.get("busqueda");
    const precioMin = searchParams.get("precioMin");
    const precioMax = searchParams.get("precioMax");

    // Construir filtros dinámicos
    const where: any = {};

    if (categoria && categoria !== "TODAS") {
      where.categoria = categoria;
    }

    if (busqueda) {
      where.OR = [
        { nombre: { contains: busqueda, mode: "insensitive" } },
        { descripcion: { contains: busqueda, mode: "insensitive" } },
      ];
    }

    if (precioMin || precioMax) {
      where.precio = {};
      if (precioMin) where.precio.gte = parseFloat(precioMin);
      if (precioMax) where.precio.lte = parseFloat(precioMax);
    }

    const productos = await prisma.producto.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}