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