'use client'
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Events from "../components/Events";
import { Event } from "@/lib/types";

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
            { id: "e1", categoria: "Alquiler", descripcion: "Alquiler de salón", fecha: new Date("2021-10-10"), monto: 2000, responsable: "Pedro Perez" },
            { id: "e2", categoria: "Reserva", descripcion: "Reserva de hotel", fecha: new Date("2021-10-10"), monto: 2524, responsable: "Maria Lopez" },
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
            { id: "e1", categoria: "Marketing", descripcion: "Marketing de materiales", fecha: new Date("2021-10-10"), monto: 560, responsable: "Luis Rodriguez" },
            { id: "e2", categoria: "Publicidad", descripcion: "Publicidad de evento", fecha: new Date("2021-10-10"), monto: 3434, responsable: "Adriana Ramirez" },
        ],
    },
]

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        setEvents(initialEvents)
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Eventos</h1>
                <Link href="/events/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Crear Evento
                    </Button>
                </Link>
            </div>
            {
                events.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No hay evento registrado</p>
                        <Link href="/events/new">
                            <Button className="gap-2">Crear Evento</Button>
                        </Link>
                    </div>
                ) : (
                    <Events events={events}/>
                )
            }
        </div>
    )
}