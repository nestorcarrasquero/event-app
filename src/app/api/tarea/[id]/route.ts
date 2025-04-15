import { prisma } from "@/app/utils/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params    
    const body = await req.json()
    try {
        await prisma.tarea.update({
            where: {
                id: Number(id)
            },
            data: {
                completado: body.completado,
            }
        })
        return NextResponse.json({
            data: body,
            message: 'Tarea actualizada satisfactoriamente'
        }, {
            status: 201
        })
    } catch (error) {
        return NextResponse.json({
            error: `Some problem ${error}`
        }, {
            status: 204
        })
    } 
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params
    try {
        await prisma.tarea.delete({
            where: {
                id: Number(id)
            }
        })
        return NextResponse.json({
            message: 'Tarea eliminada satisfactoriamente'
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