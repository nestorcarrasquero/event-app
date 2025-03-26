'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Event, IStaff } from "@/lib/types";
import { formatDate } from "@/lib/utils";
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
        staff: ["1"],
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
        staff: ["2"],
    },
]

export default function StaffDetail() {
    const params = useParams();
    const router = useRouter()
    const [staff, setStaff] = useState<IStaff>()
    const [assignedEvents, setAssignedEvents] = useState<Event[]>([])
    const [unassignedEvents, setUnassignedEvents] = useState<Event[]>([])

    useEffect(() => {
        const foundStaff = initialStaff.find((s) => s.id === params.id)
        if (foundStaff) {
            setStaff(foundStaff)
            setAssignedEvents(initialEvents.filter((e) => foundStaff.assignedEvents.includes(e.id)))
            setUnassignedEvents(initialEvents.filter((e) => !foundStaff.assignedEvents.includes(e.id)))
        } else {
            router.push("/staff")
        }
    }, [params.id, router])

    if (!staff) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>
    }

    const assignToEvent = (eventId: string) => {
        // In a real app, this would be an API call
        const updatedStaffMember = {
            ...staff,
            assignedEvents: [...staff.assignedEvents, eventId],
        }

        setStaff(updatedStaffMember)

        // Update the assigned and unassigned events lists
        const eventToAssign = unassignedEvents.find((e) => e.id === eventId) as Event
        setAssignedEvents([...assignedEvents, eventToAssign])
        setUnassignedEvents(unassignedEvents.filter((e) => e.id !== eventId))
    }

    const removeFromEvent = (eventId: string) => {
        // In a real app, this would be an API call
        const updatedStaffMember = {
            ...staff,
            assignedEvents: staff.assignedEvents.filter((id) => id !== eventId),
        }

        setStaff(updatedStaffMember)

        // Update the assigned and unassigned events lists
        const eventToUnassign = assignedEvents.find((e) => e.id === eventId) as Event
        setUnassignedEvents([...unassignedEvents, eventToUnassign])
        setAssignedEvents(assignedEvents.filter((e) => e.id !== eventId))
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
                                            <div className="font-medium">Telefono</div>
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
                                        {staff.availability.map((day, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <Checkbox id={`view-${day}`} disabled checked={true} />
                                                <label
                                                    htmlFor={`view-${day}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Eventos Asignados</CardTitle>
                            <CardDescription>Eventos en los que esta persona está asignada para trabajar</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {assignedEvents.length === 0 ? (
                                <p className="text-center py-6 text-muted-foreground">
                                    Esta persona no tiene asignado algún evento
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {assignedEvents.map((event) => (
                                        <div key={event.id} className="flex justify-between items-center p-4 border rounded-md">
                                            <div>
                                                <div className="font-medium">{event.titulo}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {formatDate(event.fechaEvento)} • {event.direccion}
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => removeFromEvent(event.id)}>
                                                Remover
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Asignar a Evento</CardTitle>
                            <CardDescription>Agregar esta persona a un evento</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {unassignedEvents.length === 0 ? (
                                <p className="text-center py-6 text-muted-foreground">No hay evento disponible para asignar</p>
                            ) : (
                                <div className="space-y-4">
                                    {unassignedEvents.map((event) => (
                                        <div key={event.id} className="flex justify-between items-center p-4 border rounded-md">
                                            <div>
                                                <div className="font-medium">{event.titulo}</div>
                                                <div className="text-sm text-muted-foreground">{formatDate(event.fechaEvento)}</div>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => assignToEvent(event.id)}>
                                                Asignar
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}