import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/prisma";

export async function GET() {
    try {
        const staff = await prisma.staff.findMany({
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
            error: `Some problem ${error}`
        }, {
            status: 500
        })
    }
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
                    connect: body.availability.map((id: number) => ({ id: Number(id) }))
                },
                roleId: Number(body.roleId),
                skills: {                    
                    connect: body.skills.map((id: number) => ({ id: Number(id) }))
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
            message: 'Staff agregado satisfactoriamente'
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