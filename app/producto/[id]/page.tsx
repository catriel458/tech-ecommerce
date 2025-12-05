import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetail from "@/components/ProductDetail";

async function getProducto(id: string) {
  try {
    const producto = await prisma.producto.findUnique({
      where: { id },
    });
    return producto;
  } catch (error) {
    return null;
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const producto = await getProducto(id);

  if (!producto) {
    notFound();
  }

  return <ProductDetail producto={producto} />;
}