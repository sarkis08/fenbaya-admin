import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {

  try {
    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
        store: true,
      }
    });

    return NextResponse.json(product);
  } catch (err) {
    console.log("[PRODUCT_GET_ERROR]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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

    if (!userId) {
      return new NextResponse("Not authenticated", { status: 401 });
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

    if(!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
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

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {}
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: images.map((image: {url: string}) => image)
          }
        }
      }
    })

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Not authenticated", { status: 401 });
    }

    // Check if productId is provided
    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Find the store by userId
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

    // Delete the product by productId
    const deleteProduct = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json({ message: "Product deleted successfully", deleteProduct });
  } catch (err) {
    console.log("[PRODUCT_DELETE_ERROR]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}