import { prisma } from "@/app/utils/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params
    const event = await prisma.event.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            gastos: {
                include: {
                    category: true
                }
            },
            typeEvent: true,
            staff: true,
            tareas: true,
        }
    })
    return NextResponse.json(event)
}