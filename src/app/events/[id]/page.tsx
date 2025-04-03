'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CalendarDays, ChevronLeft, DollarSign, MapPin, Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface TypeProps {
    id: string,
    description: string
}

/*const initialEvents: Event[] = [
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
]*/

export default function EventDetail() {
    const params = useParams<{ id: string }>();
    const router = useRouter()
    const { id } = params
    const [event, setEvent] = useState<Event | null>(null)
    const [newTask, setNewTask] = useState("")
    const [activeTab, setActiveTab] = useState("overview")
    const [newGasto, setNewGasto] = useState({
        descripcion: "",
        categoryId: "",
        monto: "",
        responsable: "",
        eventId: id,
        fecha: new Date(),
    })
    const [categories, setCategories] = useState([])

    const fetchEvent = useCallback(async () => {
        const res = await fetch(`/api/event/${id}`)
        const result = await res.json()
        if (result) {
            setEvent(result)
        } else {
            router.push("/events")
        }
    }, [id, router])

    const fetchCategory = useCallback(async () => {
        const res = await fetch('/api/category')
        const result = await res.json()
        const data = await result.map((x: TypeProps) => {
            return {
                id: String(x.id),
                description: x.description
            }
        })
        setCategories(data)
    }, [])

    useEffect(() => {
        fetchEvent()
        fetchCategory()
    }, [fetchEvent, fetchCategory])

    if (!event) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>
    }

    const toggleTaskCompletion = async (taskId: string) => {
        if (taskId === "") return
        const settings = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completado: !event.tareas.find((tarea) => tarea.id === taskId)?.completado
            }),
        }
        try {
            const fetchResponse = await fetch(`/api/tarea/${taskId}`, settings)
            const data = await fetchResponse.json()

            toast("Mensaje de la aplicación", {
                description: data.message,
                className: "text-lg font-bold"
            })

            fetchEvent()            
        } catch (error) {
            return error
        }        
    }

    const addTask = async () => {
        if (newTask.trim() === "") return
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventId: id,
                nombre: newTask,
            }),
        }
        try {
            const fetchResponse = await fetch('/api/tarea', settings)
            const data = await fetchResponse.json()

            toast("Mensaje de la aplicación", {
                description: data.message,
                className: "text-lg font-bold"
            })

            fetchEvent()
            setNewTask("")
        } catch (error) {
            return error
        }

        /*setEvent({
            ...event,
            tareas: [...event.tareas, { id: `t${Date.now()}`, nombre: newTask, completado: false }],
        })*/

    }

    const removeExpense = (expenseId: string) => {
        setEvent({
            ...event,
            gastos: event.gastos.filter((gasto) => gasto.id !== expenseId),
        })
    }

    const totalExpenses = event.gastos ? event.gastos.reduce((sum, gasto) => sum + gasto.monto, 0) : 0

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGasto),
        }
        try {
            const fetchResponse = await fetch('/api/gasto', settings)
            const data = await fetchResponse.json()

            toast("Mensaje de la aplicación", {
                description: data.message,
                className: "text-lg font-bold"
            })

            fetchEvent()

            setNewGasto({
                descripcion: "",
                categoryId: "",
                monto: "",
                responsable: "",
                eventId: id,
                fecha: new Date(),
            })
        } catch (error) {
            return error
        }
    }

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
                    <TabsTrigger value="overview">Vista Preliminar</TabsTrigger>
                    <TabsTrigger value="tasks">Tareas</TabsTrigger>
                    <TabsTrigger value="expenses">Gastos</TabsTrigger>
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
                                <CardTitle>Tareas x</CardTitle>
                                <CardDescription>
                                    {event.tareas ? event.tareas.filter((t) => t.completado).length : 0}&nbsp;de&nbsp;
                                    {event.tareas ? event.tareas.length : 0}&nbsp;completados
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {
                                    event.tareas && event.tareas.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No hay Tarea registrada</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {
                                                event.tareas && event.tareas.map((tarea) => (
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
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )
                                }
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Gastos Recientes</CardTitle>
                                <CardDescription>
                                    {event.gastos ? event.gastos.length : 0}&nbsp;gastos totalizando&nbsp;${totalExpenses.toFixed(2)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {
                                    event.gastos && event.gastos.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No hay gasto registrado</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {
                                                event.gastos && event.gastos.slice(0, 3).map((gasto) => (
                                                    <div key={gasto.id} className="flex justify-between items-center">
                                                        <div>
                                                            <div className="font-medium text-sm">{gasto.descripcion}</div>
                                                            <div className="text-xs text-muted-foreground">Contratado por {gasto.responsable}</div>
                                                        </div>
                                                        <div className="font-medium">${gasto.monto.toFixed(2)}</div>
                                                    </div>
                                                ))
                                            }
                                            {
                                                event.gastos && event.gastos.length > 3 && (
                                                    <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("expenses")}>
                                                        Ver todos los Gastos
                                                    </Button>
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="tasks">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tareas y</CardTitle>
                            <CardDescription>
                                {event.tareas ? event.tareas.filter((t) => t.completado).length : 0}&nbsp;de&nbsp;
                                {event.tareas ? event.tareas.length : 0}&nbsp;completadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Agregue tarea"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                addTask()
                                            }
                                        }}
                                    />
                                    <Button onClick={addTask} size="icon">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {
                                        event.tareas && event.tareas.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No hay Tarea registrada</p>
                                        ) : (
                                            event.tareas && event.tareas.map((tarea) => (
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
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="expenses">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 overflow-y-auto max-h-[700px]">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gastos</CardTitle>
                                    <CardDescription>
                                        Total: ${totalExpenses.toFixed(2)}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {event.gastos && event.gastos.length === 0 ? (
                                        <p className="text-center py-6 text-muted-foreground">No hay gasto guardado</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {event.gastos && event.gastos.map((gasto) => (
                                                <div key={gasto.id} className="flex justify-between items-center p-3 border rounded-md">
                                                    <div>
                                                        <div className="font-medium">{gasto.descripcion}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {gasto.categoria} • Contratado por {gasto.responsable} • {formatDate(gasto.fecha)}
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
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Agregar Gasto</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-4" onSubmit={onSubmit}>
                                        <div className="space-y-2">
                                            <Label htmlFor="descripcion">Descripción</Label>
                                            <Input
                                                id="descripcion"
                                                placeholder="Descripción del gasto"
                                                value={newGasto.descripcion}
                                                onChange={(e) => setNewGasto({ ...newGasto, descripcion: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="amount">Monto</Label>
                                            <Input
                                                id="monto"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                value={newGasto.monto}
                                                onChange={(e) => setNewGasto({ ...newGasto, monto: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="categoryId">Categoría</Label>
                                            <Select
                                                value={newGasto.categoryId}
                                                onValueChange={(value) => setNewGasto({ ...newGasto, categoryId: value })}
                                            >
                                                <SelectTrigger id="categoryId">
                                                    <SelectValue placeholder="Seleccione una categoría de gastos" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category: TypeProps) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.description}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="responsable">Responsable</Label>
                                            <Input
                                                id="responsable"
                                                placeholder="Responsable del gasto"
                                                value={newGasto.responsable}
                                                onChange={(e) => setNewGasto({ ...newGasto, responsable: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full">
                                            Enviar
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}