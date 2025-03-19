'use client'
import { Button } from "@/components/ui/button";
import { IStaff } from "@/lib/types";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Staff from "../components/Staff";

const initialStaff: IStaff[] = [
    {
        id: "1",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "555-123-4567",
        role: "Event Coordinator",
        skills: ["Setup", "Coordination", "Customer Service"],
        assignedEvents: ["1"],
        availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: false,
            sunday: false,
        },
    },
    {
        id: "2",
        name: "Morgan Smith",
        email: "morgan.smith@example.com",
        phone: "555-987-6543",
        role: "Technical Support",
        skills: ["AV Equipment", "Lighting", "Sound Systems"],
        assignedEvents: ["2"],
        availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: false,
        },
    },
    {
        id: "3",
        name: "Jamie Wilson",
        email: "jamie.wilson@example.com",
        phone: "555-456-7890",
        role: "Logistics Manager",
        skills: ["Inventory", "Transportation", "Vendor Management"],
        assignedEvents: ["1", "2"],
        availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true,
        },
    },
]

export default function StaffPage() {
    const [staff, setStaff] = useState<IStaff[]>([])

    useEffect(() => {
        setStaff(initialStaff)
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center gap-1 mb-6 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />Regresa a Página Principal
            </Link>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Staff</h1>
                <Link href="/events/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Incluir
                    </Button>
                </Link>
            </div>
            {
                staff.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No hay personal registrado</p>
                        <Link href="/events/new">
                            <Button className="gap-2">Incluir</Button>
                        </Link>
                    </div>
                ) : (
                    <Staff staffs={staff} />
                )
            }
        </div>
    )
}