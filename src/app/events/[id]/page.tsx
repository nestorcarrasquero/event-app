'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CalendarDays, ChevronLeft, DollarSign, MapPin, Trash2, Users } from "lucide-react";
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

export default function EventDetail() {
    const params = useParams();
    const router = useRouter()
    const [event, setEvent] = useState<Event | null>(null)
    const [activeTab, setActiveTab] = useState("overview")

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
            tareas: event.tareas.map((tarea) => (tarea.id === taskId ? { ...tarea, completado: !tarea.completado } : tarea)),
        })
    }

    const removeExpense = (expenseId: string) => {
        setEvent({
            ...event,
            gastos: event.gastos.filter((gasto) => gasto.id !== expenseId),
        })
    }

    const totalExpenses = event.gastos.reduce((sum, gasto) => sum + gasto.monto, 0)

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/events" className="inline-flex items-center gap-1 mb-6 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />Regresa a Lista de Eventos
            </Link>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">{event.titulo}</h1>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles de Evento</CardTitle>
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
                            <div className="flex items-start gap-2">
                                <DollarSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-medium">Total en Gastos</div>
                                    <div>${totalExpenses.toFixed(2)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tareas</CardTitle>
                                <CardDescription>
                                    {event.tareas.filter((t) => t.completado).length} de {event.tareas.length} completados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {
                                        event.tareas.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No hay gasto registrado</p>
                                        ) : (
                                            event.tareas.map((tarea) => (
                                                <div key={tarea.id} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={tarea.id}
                                                            checked={tarea.completado}
                                                            onCheckedChange={() => toggleTaskCompletion(tarea.id)}
                                                        />
                                                        <label
                                                            htmlFor={tarea.id}
                                                            className={`text-sm ${tarea.completado ? "line-through text-muted-foreground" : ""}`}
                                                        >
                                                            {tarea.nombre}
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Gastos Recientes</CardTitle>
                                <CardDescription>
                                    {event.gastos.length} gastos totalizando ${totalExpenses.toFixed(2)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {event.gastos.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No hay gasto registrado</p>
                                ) : (
                                    <div className="space-y-2">
                                        {event.gastos.slice(0, 3).map((gasto) => (
                                            <div key={gasto.id} className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium text-sm">{gasto.descripcion}</div>
                                                    <div className="text-xs text-muted-foreground">Paid by {gasto.responsable}</div>
                                                </div>
                                                <div className="font-medium">${gasto.monto.toFixed(2)}</div>
                                            </div>
                                        ))}
                                        {event.gastos.length > 3 && (
                                            <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("expenses")}>
                                                View all expenses
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="tasks">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tareas</CardTitle>
                            <CardDescription>
                                {event.tareas.filter((t) => t.completado).length} de {event.tareas.length} completados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>

                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="expenses">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gastos</CardTitle>
                                    <CardDescription>
                                        Total: ${totalExpenses.toFixed(2)}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {event.gastos.length === 0 ? (
                                        <p className="text-center py-6 text-muted-foreground">No hay gasto guardado</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {event.gastos.map((gasto) => (
                                                <div key={gasto.id} className="flex justify-between items-center p-3 border rounded-md">
                                                    <div>
                                                        <div className="font-medium">{gasto.descripcion}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {gasto.categoria} • Paid by {gasto.responsable} • {formatDate(gasto.fecha)}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="font-medium">${gasto.monto.toFixed(2)}</div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeExpense(gasto.id)}
                                                            className="h-7 w-7"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}