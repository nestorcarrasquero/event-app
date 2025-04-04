import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function GET() {
    try {
        const tarea = await prisma.gasto.findMany();
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
        await prisma.gasto.create({
            data: {
                descripcion: body.descripcion,
                fecha: body.fecha,
                monto: parseFloat(body.monto),
                responsable: body.responsable,
                eventId: Number(body.eventId),
                categoryId: Number(body.categoryId),
            }
        })
        return NextResponse.json({
            data: body,
            message: 'Gasto agregado satisfactoriamente',
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