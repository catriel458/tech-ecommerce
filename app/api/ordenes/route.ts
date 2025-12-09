import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST - Crear nueva orden
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { items, total } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    // Crear orden con items
    const orden = await prisma.orden.create({
      data: {
        userId: session.user.id,
        total,
        estado: "PENDIENTE",
        items: {
          create: items.map((item: any) => ({
            productoId: item.id,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
          })),
        },
      },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
      },
    });

    // Opcional: Reducir stock de productos
    for (const item of items) {
      await prisma.producto.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.cantidad,
          },
        },
      });
    }

    return NextResponse.json(orden, { status: 201 });
  } catch (error) {
    console.error("Error al crear orden:", error);
    return NextResponse.json(
      { error: "Error al crear orden" },
      { status: 500 }
    );
  }
}

// GET - Obtener órdenes del usuario
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const ordenes = await prisma.orden.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(ordenes);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    return NextResponse.json(
      { error: "Error al obtener órdenes" },
      { status: 500 }
    );
  }
}