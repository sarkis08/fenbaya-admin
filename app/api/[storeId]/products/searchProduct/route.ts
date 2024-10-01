import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(req: Request, res: Response) {
  //await runMiddleware(req, res, cors); // Apply CORS middleware

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";  // Extract query parameter

  try {
    const products = await prismadb.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
      },
      take: 5, // Limit to the first 5 results
    });

    const response = NextResponse.json(products);
    response.headers.set('Access-Control-Allow-Origin', 'https://fenbaya-admin.vercel.app/api/66de4a96-47fc-4e55-94f8-c9b38d9b3c25');
    return response;
  } catch (error) {
    console.error("[PRODUCT_SEARCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

