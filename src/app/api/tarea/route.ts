import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function GET() {
    try {
        const tarea = await prisma.tarea.findMany();
        return NextResponse.json(tarea);
    } catch (error) {
        return NextResponse.json({
            data: null,
            message: `Some problem ${error}`,
            status: 500
        })
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        await prisma.tarea.create({
            data: {
                nombre: body.nombre,
                eventId: Number(body.eventId),
            }
        })
        return NextResponse.json({
            data: body,
            message: 'Tarea agregada satisfactoriamente',
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