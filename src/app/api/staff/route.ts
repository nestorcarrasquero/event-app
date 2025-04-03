import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function GET() {
    const staff = await prisma.staff.findMany({
        include: {
            availability: true,
            role: true,
            skills: true,
            events: true,
        }
    });
    return NextResponse.json(staff);
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        await prisma.staff.create({
            data: {
                email: body.email,
                nombre: body.nombre,
                telefono: body.telefono,
                availability: {
                    connect: body.availability.map((id: number) => ({ id: id }))
                },
                roleId: body.roleId,
                skills: {
                    connect: body.skills.map((id: number) => ({ id: id }))
                }
            },
            include: {
                availability: true,
                role: true,
                skills: true,
            }
        })
        return NextResponse.json({
            data: body,
            message: 'Staff added successfully',
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

export async function PUT(req: NextRequest) {
    const body = await req.json()
    try {
        await prisma.staff.update({
            where: {
                id: body.id,
            },
            data: {
                events: {
                    set: body.events.map((id: number) => ({ id: id }))
                }
            },
            include: {
                events: true,
            }
        })
        return NextResponse.json({
            data: body,
            message: 'Staff updated successfully',
            status: 201
        })
    } catch (error) {
        return NextResponse.json({
            data: null,
            message: `Some problem ${error}`,
            status: 204
        })
    }
}