import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Total de productos
    const totalProductos = await prisma.producto.count();

    // Total de usuarios
    const totalUsuarios = await prisma.user.count();

    // Productos con stock bajo (menos de 5)
    const productosStockBajo = await prisma.producto.count({
      where: {
        stock: {
          lte: 5,
          gt: 0,
        },
      },
    });

    // Productos sin stock
    const productosSinStock = await prisma.producto.count({
      where: {
        stock: 0,
      },
    });

    // Valor total del inventario
    const productos = await prisma.producto.findMany({
      select: {
        precio: true,
        stock: true,
      },
    });

    const valorInventario = productos.reduce(
      (total, producto) => total + producto.precio * producto.stock,
      0
    );

    // Productos por categoría
    const productosPorCategoria = await prisma.producto.groupBy({
      by: ["categoria"],
      _count: {
        categoria: true,
      },
    });

    // Top 5 productos más caros
    const productosTopPrecio = await prisma.producto.findMany({
      take: 5,
      orderBy: {
        precio: "desc",
      },
      select: {
        id: true,
        nombre: true,
        precio: true,
        stock: true,
        categoria: true,
      },
    });

    // Stock por categoría
    const stockPorCategoria = await prisma.producto.groupBy({
      by: ["categoria"],
      _sum: {
        stock: true,
      },
    });

    return NextResponse.json({
      totalProductos,
      totalUsuarios,
      productosStockBajo,
      productosSinStock,
      valorInventario,
      productosPorCategoria,
      productosTopPrecio,
      stockPorCategoria,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}