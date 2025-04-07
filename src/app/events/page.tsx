'use client'
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Events from "../components/Events";
import { Event } from "@/lib/types";
import { Spinner } from "../components/Spinner";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        async function fetchEvents() {
            try {
                const res = await fetch('/api/event')
                const result = await res.json()
                setEvents(result)
            } catch (error) {
                return error
            }
        }
        fetchEvents()        
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center gap-1 mb-6 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />Regresa a Página Principal
            </Link>
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
                        <Spinner />
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