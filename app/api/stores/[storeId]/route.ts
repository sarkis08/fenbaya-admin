import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    // Check if store name is provided
    if (!name) {
      return new NextResponse("Store name is required", { status: 400 });
    }

    // Check if storeId is provided
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // find the store
    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_UPDATE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Not authenticated", { status: 401 });
      }
  
      // Check if storeId is provided
      if (!params.storeId) {
        return new NextResponse("Store ID is required", { status: 400 });
      }
  
      // find the store
      const store = await prismadb.store.deleteMany({
        where: {
          id: params.storeId,
          userId,
        },
      });
  
      return NextResponse.json(store);
    } catch (error) {
      console.log("[STORE_DELETE_ERROR]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }