import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import cors from "@/lib/cors";

export async function GET(req: Request, res: Response) {
  await runMiddleware(req, res, cors); // Apply CORS middleware

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
    response.headers.set('Access-Control-Allow-Origin', 'https://fenbaya-client.vercel.app');
    return response;
  } catch (error) {
    console.error("[PRODUCT_SEARCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

