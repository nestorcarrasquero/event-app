import { prisma } from "@/app/utils/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params
    try {
        const staff = await prisma.staff.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                availability: true,
                role: true,
                skills: true,
                events: true,
            }
        });
        return NextResponse.json(staff);
    } catch (error) {
        return NextResponse.json({
            data: null,
            error: `Some problem ${error}`
        }, {
            status: 500
        })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params
    const body = await req.json()
    try {
        if (body.assign === 'true') {
            await prisma.staff.update({
                where: {
                    id: Number(id),
                },
                data: {
                    events: {
                        connect: [
                            { id: Number(body.eventId) }
                        ]
                    }
                },
                include: {
                    events: true,
                }
            })
        } else {
            await prisma.staff.update({
                where: {
                    id: Number(id),
                },
                data: {
                    events: {
                        disconnect: [
                            { id: Number(body.eventId) }
                        ]
                    }
                },
                include: {
                    events: true,
                }
            })
        }        
        return NextResponse.json({
            data: body,
            message: 'Staff updated successfully'
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