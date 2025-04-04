import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const typeEvents = await prisma.typeEvent.findMany()
        return NextResponse.json(typeEvents)
    } catch (error) {
        return NextResponse.json({
            data: null,
            message: `Some problem ${error}`,
            status: 500
        })
    }    
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        await prisma.typeEvent.create({
            data: {
                description: body.description,
            }
        })
        return NextResponse.json({
            data: body,
            message: 'Type Event added successfully',
            status: 200
        })
    } catch (error) {   
        return NextResponse.json({
            data: null,
            message: `Some problem ${error}`,
            status: 500
        })
    }
}