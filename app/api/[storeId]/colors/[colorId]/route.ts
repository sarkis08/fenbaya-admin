import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (err) {
    console.log("[COLOR_GET_ERROR]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    // Check if storeId and colorId are provided
    if (!params.storeId || !value) {
      return new NextResponse("Store ID and color ID are required", {
        status: 400,
      });
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

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR_PATCH_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    // Check if colorId are provided
    if (!params.colorId) {
      return new NextResponse("Store ID and color ID are required", {
        status: 400,
      });
    }

    // find the store by userId
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // Check if store belongs to unauthenticated user
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const color = await prismadb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (err) {
    console.log("[COLOR_DELETE_ERROR]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
