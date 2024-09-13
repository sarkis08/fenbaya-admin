import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {

    try {

        const { userId } = auth()
        const body = await req.json()

        const { name } = body

        // Check if user is authenticated
        if (!userId) {
            return new NextResponse("Not authenticated", { status: 401 })
        }

        // Check if store name is provided
        if (!name) {
            return new NextResponse("Store name is required", { status: 400 })
        }

        // Add store logic here
        const store = await prismadb.store.create({
            data: {
                name,
                userId: userId,
            },
        })

        return NextResponse.json(store)

        
    } catch (error) {
        console.log("[STORES_POST_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
        
    }

}