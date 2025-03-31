import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function GET() {
    const tarea = await prisma.gasto.findMany();
    return NextResponse.json(tarea);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        await prisma.gasto.create({
            data: {
                descripcion: body.descripcion,
                fecha: body.fecha,
                monto: body.monto,
                responsable: body.responsable,
                eventId: body.eventId,
                categoryId: body.categoryId,
            }
        })
        return NextResponse.json({
            data: body,
            message: 'Expense added successfully',
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