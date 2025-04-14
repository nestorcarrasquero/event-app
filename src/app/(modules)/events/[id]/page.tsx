'use client'
import { Spinner } from "@/app/components/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, ChevronLeft, DollarSign, MapPin, Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface TypeProps {
    id: string,
    description: string
}

const FormSchema = z.object({
    descripcion: z.string().min(1, { message: "Se requiere la descripción" }),
    categoryId: z.string().min(1, { message: "Categoría es obligatoria" }),
    monto: z.string().min(1, { message: "Monto requerido" }),
    responsable: z.string().min(1, { message: "Responsable es obligatorio" }),
    eventId: z.string().min(1, { message: "Evento requerido" }),
    fecha: z.date().min(new Date(), { message: "La fecha del gasto es requerida" }),
})

export default function EventDetail() {
    const params = useParams<{ id: string }>();
    const router = useRouter()
    const { id } = params
    const [event, setEvent] = useState<Event | null>(null)
    const [newTask, setNewTask] = useState("")
    const [activeTab, setActiveTab] = useState("overview")
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            descripcion: "",
            categoryId: "",
            monto: "",
            responsable: "",
            eventId: id,
            fecha: new Date(),
        },
    })

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
        setLoading(true)
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
        } finally {
            setLoading(false)
        }
    }

    const addTask = async () => {
        if (newTask.trim() === "") return
        setLoading(true)
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
        } finally {
            setLoading(false)
        }
    }

    const removeExpense = async (expenseId: string) => {
        if (expenseId === "") return
        setLoading(true)
        const settings = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
        try {
            const fetchResponse = await fetch(`/api/gasto/${expenseId}`, settings)
            const data = await fetchResponse.json()

            toast("Mensaje de la aplicación", {
                description: data.message,
                className: "text-lg font-bold"
            })

            fetchEvent()
        } catch (error) {
            return error
        } finally {
            setLoading(false)
        }
    }

    const removeTask = async (taskId: string) => {
        if (taskId === "") return
        setLoading(true)
        const settings = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
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
        } finally {
            setLoading(false)
        }
    }

    const totalExpenses = event.gastos ? event.gastos.reduce((sum, gasto) => sum + gasto.monto, 0) : 0

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }
        try {
            const fetchResponse = await fetch('/api/gasto', settings)
            const data = await fetchResponse.json()

            toast("Mensaje de la aplicación", {
                description: data.message,
                className: "text-lg font-bold"
            })

            fetchEvent()

            form.reset()
        } catch (error) {
            return error
        } finally {
            setLoading(false)
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
            { loading ? <Spinner /> : null}
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
                                <CardTitle>Tareas</CardTitle>
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
                            <CardTitle>Tareas</CardTitle>
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
                                                    <Button variant="ghost" size="icon" className="h-7 w-7"
                                                        onClick={() => removeTask(tarea.id)}
                                                    >
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
                                                            {gasto.category.description} • Contratado por {gasto.responsable} • {formatDate(gasto.fecha)}
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
                                    <Form {...form}>
                                        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                                            <div className="space-y-6">
                                                <FormField
                                                    control={form.control}
                                                    name="descripcion"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Titulo</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Descripción del gasto" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="monto"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Monto</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="0.00" {...field}
                                                                    type="number"
                                                                    step={0.01}
                                                                    min={0}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="categoryId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Categoría</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value} key={`category-${field.value}`}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Seleccione una categoría de gastos" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent position="popper">
                                                                    {
                                                                        categories.map((category: TypeProps) => (
                                                                            <SelectItem value={category.id} key={category.id}>{category.description}</SelectItem>
                                                                        ))
                                                                    }
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="responsable"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Responsable</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="Responsable del gasto" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <CardFooter className="flex justify-between">
                                                    <Button type="submit" className="w-full">
                                                        Enviar
                                                    </Button>
                                                </CardFooter>
                                            </div>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>                
            </Tabs>
        </div>
    )
}