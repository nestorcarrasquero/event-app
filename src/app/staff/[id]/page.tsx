'use client'
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Event, IStaff } from "@/lib/types";
import { Calendar, ChevronLeft, Mail, Phone } from "lucide-react";
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
        availability: ["martes", "miercoles", "jueves", "viernes", "sabado", "domingo"],
    },
    {
        id: "2",
        nombre: "Morgan Smith",
        email: "morgan.smith@example.com",
        telefono: "555-987-6543",
        rol: "Technical Support",
        skills: ["AV Equipment", "Lighting", "Sound Systems"],
        assignedEvents: ["2"],
        availability: ["lunes", "martes", "miercoles", "jueves", "sabado"],
    },
    {
        id: "3",
        nombre: "Jamie Wilson",
        email: "jamie.wilson@example.com",
        telefono: "555-456-7890",
        rol: "Logistics Manager",
        skills: ["Inventory", "Transportation", "Vendor Management"],
        assignedEvents: ["1", "2"],
        availability: ["lunes", "martes", "miercoles", "jueves", "viernes", "domingo"],
    },
]

const initialEvents: Event[] = [
    {
        id: "1",
        titulo: "Evento uno",
        fechaEvento: new Date("2021-10-10"),
        fechaContrato: new Date("2021-10-01"),
        organizador: "Organizador uno",
        direccion: "Dirección uno",
        cliente: "Cliente uno",
        email: "evento@direccion.com",
        telefono: "1234567890",
        tareas: [
            { id: "t1", nombre: "Book accommodation", completado: true },
            { id: "t2", nombre: "Arrange transportation", completado: false },
            { id: "t3", nombre: "Plan activities", completado: false },
        ],
        gastos: [
            { id: "e1", categoria: "Alquiler", descripcion: "Alquiler de salón", fecha: new Date(), monto: 2000, responsable: "Pedro Perez" },
            { id: "e2", categoria: "Reserva", descripcion: "Reserva de hotel", fecha: new Date(), monto: 2524, responsable: "Maria Lopez" },
        ],
    },
    {
        id: "2",
        titulo: "Evento dos",
        fechaEvento: new Date("2021-10-10"),
        fechaContrato: new Date("2021-10-01"),
        organizador: "Organizador dos",
        direccion: "Dirección dos",
        cliente: "Cliente dos",
        email: "evento@direccion.com",
        telefono: "1234567890",
        tareas: [
            { id: "t1", nombre: "Prepare presentation", completado: true },
            { id: "t2", nombre: "Send invitations", completado: true },
            { id: "t3", nombre: "Set up demo stations", completado: false },
        ],
        gastos: [
            { id: "e1", categoria: "Marketing", descripcion: "Marketing de materiales", fecha: new Date(), monto: 560, responsable: "Luis Rodriguez" },
            { id: "e2", categoria: "Publicidad", descripcion: "Publicidad de evento", fecha: new Date(), monto: 3434, responsable: "Adriana Ramirez" },
        ],
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div>
                                <CardTitle>{staff.nombre}</CardTitle>
                                <CardDescription>{staff.rol}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Email</div>
                                            <div>{staff.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Phone</div>
                                            <div>{staff.telefono}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <div className="font-medium">Eventos Asignados</div>
                                            <div>
                                                {staff.assignedEvents.length} evento{staff.assignedEvents.length !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium mb-2">Skills</div>
                                    <div className="flex flex-wrap gap-1">
                                        {staff.skills.map((skill, index) => (
                                            <Badge key={index} variant="secondary">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="font-medium mt-4 mb-2">Disponibilidad</div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {Object.entries(staff.availability).map((day, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <Checkbox id={`view-${day}`}  disabled />
                                                <label
                                                    htmlFor={`view-${day}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {day}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}