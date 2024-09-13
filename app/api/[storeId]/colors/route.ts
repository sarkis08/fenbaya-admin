import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    // Check if user is authenticated
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Check if name is provided
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Check if billboardId is provided
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    // Check if storeId is provided
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // find the store by userId
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // Check if store belongs to authenticated user
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Add color logic here
    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS_POST_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // Check if storeId is provided
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Add colors logic here
    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
