import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function GET() {
    const events = await prisma.event.findMany();
    return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        await prisma.event.create({
            data: {
                cliente: body.cliente,
                direccion: body.direccion,
                email: body.email,
                fechaContrato: body.fechaContrato,
                fechaEvento: body.fechaEvento,
                organizador: body.organizador,
                telefono: body.telefono,
                titulo: body.titulo,
                typeEvent: body.typeEvent,
            }
        })
        return NextResponse.json({
            data: body,
            message: 'Event added successfully',
            status: 201
        })
    } catch (error) {
        return NextResponse.json({
            data: null,
            message: `Some problem ${error}`,
            status: 500
        })
    }
}