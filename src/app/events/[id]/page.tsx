'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Event } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CalendarDays, ChevronLeft, MapPin, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        expenses: [
            { id: "t1", name: "Book accommodation", completed: true },
            { id: "t2", name: "Arrange transportation", completed: false },
            { id: "t3", name: "Plan activities", completed: false },
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
        expenses: [
            { id: "t1", name: "Prepare presentation", completed: true },
            { id: "t2", name: "Send invitations", completed: true },
            { id: "t3", name: "Set up demo stations", completed: false },
        ],
    },
]

export default function EventDetail() {
    const params = useParams();
    const router = useRouter()
    const [event, setEvent] = useState<Event | null>(null)

    useEffect(() => {
        const foundEvent = initialEvents.find((event) => event.id === params.id)
        if (foundEvent) {
            setEvent(foundEvent)
        } else {
            router.push("/events")
        }
    }, [params.id, router])

    if (!event) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>
    }

    const toggleTaskCompletion = (taskId: string) => {
        setEvent({
            ...event,
            expenses: event.expenses.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
        })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/events" className="inline-flex items-center gap-1 mb-6 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />Regresa a Lista de Eventos
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{event.titulo}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-2">
                                <CalendarDays className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-medium">Fecha del Evento</div>
                                    <span>{formatDate(event.fechaEvento)}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-medium">Dirección</div>
                                    <span className="line-clamp-1">{event.direccion}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-medium">Organizador</div>
                                    <span>{event.organizador}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Gastos</CardTitle>
                            <CardDescription>
                                {event.expenses.filter((t) => t.completed).length} de {event.expenses.length} completados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {
                                    event.expenses.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No hay gasto registrado</p>
                                    ) : (
                                        event.expenses.map((expense) => (
                                            <div key={expense.id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={expense.id}
                                                        checked={expense.completed}
                                                        onCheckedChange={() => toggleTaskCompletion(expense.id)}
                                                    />
                                                    <label
                                                        htmlFor={expense.id}
                                                        className={`text-sm ${expense.completed ? "line-through text-muted-foreground" : ""}`}
                                                    >
                                                        {expense.name}
                                                    </label>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}