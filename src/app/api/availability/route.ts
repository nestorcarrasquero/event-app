import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const availability = await prisma.availability.findMany();
        return NextResponse.json(availability);
    } catch (error) {
        return NextResponse.json({
            error: `Some problem ${error}`
        }, {
            status: 500
        })
    }
}