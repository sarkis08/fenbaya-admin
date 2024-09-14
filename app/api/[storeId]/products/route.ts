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

    const { 
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
     } = body;

    // Check if user is authenticated
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Check if name is provided
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Check if price is provided
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    // Check if categoryId, sizeId, colorId are provided
    if (!categoryId ||!sizeId ||!colorId) {
      return new NextResponse("Category ID, Size ID, and Color ID are required", {
        status: 400,
      });
    }

    // Check if images are provided
    if (!images || images.length === 0) {
      return new NextResponse("Images are required", { status: 400 });
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

    // Add product logic here
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [
              ...images.map((image: {url: string}) => image)
            ]
          }
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined
    const colorId = searchParams.get("colorId") || undefined
    const sizeId = searchParams.get("sizeId") || undefined
    const isFeatured = searchParams.get("isFeatured")

    // Check if storeId is provided
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Add product logic here
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
