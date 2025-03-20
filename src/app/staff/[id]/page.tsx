'use client'
import { IStaff } from "@/lib/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const initialStaff: IStaff[] = [
    {
        id: "1",
        nombre: "Alex Johnson",
        email: "alex.johnson@example.com",
        telefono: "555-123-4567",
        rol: "Event Coordinator",
        skills: ["Setup", "Coordination", "Customer Service"],
        assignedEvents: ["1"],
        availability: [],
    },
    {
        id: "2",
        nombre: "Morgan Smith",
        email: "morgan.smith@example.com",
        telefono: "555-987-6543",
        rol: "Technical Support",
        skills: ["AV Equipment", "Lighting", "Sound Systems"],
        assignedEvents: ["2"],
        availability: [],
    },
    {
        id: "3",
        nombre: "Jamie Wilson",
        email: "jamie.wilson@example.com",
        telefono: "555-456-7890",
        rol: "Logistics Manager",
        skills: ["Inventory", "Transportation", "Vendor Management"],
        assignedEvents: ["1", "2"],
        availability: [],
    },
]

export default function StaffDetail() {
    const params = useParams();
    const router = useRouter()
    const [staff, setStaff] = useState<IStaff | null>(null)

    useEffect(() => {
        const foundStaff = initialStaff.find((staff) => staff.id === params.id)
        if (foundStaff) {
            setStaff(foundStaff)
        } else {
            router.push("/staff")
        }
    }, [params.id, router])

    if (!staff) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/staff" className="inline-flex items-center gap-1 mb-6 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />Regresa a Lista de Staff
            </Link>
        </div>
    )
}