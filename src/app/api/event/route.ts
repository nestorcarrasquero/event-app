import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            include: {
                typeEvent: true,
                tareas: true,
                gastos: true,
                staff: true,
            }
        });
        return NextResponse.json(events);
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
                typeEventId: Number(body.typeEventId),
            }
        })
        return NextResponse.json({
            data: body,
            message: 'Evento agregado satisfactoriamente',
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