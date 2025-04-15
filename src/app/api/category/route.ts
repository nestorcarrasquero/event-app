import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({
            error: `Some problem ${error}`
        }, {
            status: 500
        })
    }
}