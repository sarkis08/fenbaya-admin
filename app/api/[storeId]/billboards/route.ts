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

    const { label, imageUrl } = body;

    // Check if user is authenticated
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Check if label is provided
    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    // Check if imageUrl is provided
    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
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

    // Add billboard logic here
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARDS_POST_ERROR]", error);
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

    // Add billboard logic here
    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARDS_GET_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
