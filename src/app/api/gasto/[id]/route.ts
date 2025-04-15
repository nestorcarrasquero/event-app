import { prisma } from "@/app/utils/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params
    try {
        await prisma.gasto.delete({
            where: {
                id: Number(id)
            }
        })
        return NextResponse.json({
            message: 'Gasto eliminado satisfactoriamente'
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            error: `Some problem ${error}`
        }, {
            status: 500
        })
    }
}