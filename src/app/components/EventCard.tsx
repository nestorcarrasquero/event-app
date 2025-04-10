'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { isValidPhoneNumber } from "react-phone-number-input";
import { PhoneInput } from "@/components/ui/phone-input"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Spinner } from "./Spinner"

interface TypeProps {
    id: string,
    description: string
}

const FormSchema = z.object({
    fechaEvento: z.date({
        required_error: "La fecha del evento es requerida",
    }),
    fechaContrato: z.date({
        required_error: "La fecha del evento es requerida",
    }),
    titulo: z.string().min(2, {
        message: "El título debe tener al menos 2 caracteres"
    }),
    typeEventId: z.string({
        required_error: "El tipo de evento es requerido",
    }),
    organizador: z.string().min(2, {
        message: "El organizador debe tener al menos 2 caracteres"
    }),
    direccion: z.string().min(2, {
        message: "La dirección debe tener al menos 2 caracteres"
    }),
    cliente: z.string().min(2, {
        message: "El cliente debe tener al menos 2 caracteres"
    }),
    email: z.string().min(2, {
        message: "El email debe tener al menos 2 caracteres"
    }).email({
        message: "El email debe ser válido"
    }),
    telefono: z
        .string()
        .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
})


export default function EventCard() {
    const [typeEvent, setTypeEvent] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchTypeEvent() {
            const res = await fetch('/api/typeEvent')
            const result = await res.json()
            const data = await result.map((x: TypeProps) => {
                return {
                    id: String(x.id),
                    description: x.description
                }
            })
            setTypeEvent(data)
        }
        fetchTypeEvent()
    }, [])

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            fechaEvento: new Date(),
            titulo: '',
            fechaContrato: new Date(),
            organizador: '',
            direccion: '',
            cliente: '',
            email: '',
            telefono: '',
            typeEventId: '',
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        };
        try {            
            const fetchResponse = await fetch('/api/event', settings)
            const data = await fetchResponse.json()
            toast("Mensaje de la aplicación", {
                description: data.message
            })            
            form.reset()
        } catch (error) {
            return error
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[500px] shadow-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Crear Evento</CardTitle>
                        <CardDescription>Ingrese los datos necesarios para crear el evento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="titulo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Titulo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del Evento" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="typeEventId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} key={`tipo-${field.value}`}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione el tipo de evento" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent position="popper">
                                                {
                                                    typeEvent.map((tipo: TypeProps) => (
                                                        <SelectItem value={tipo.id} key={tipo.id}>{tipo.description}</SelectItem>
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
                                name="fechaEvento"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fecha de Evento</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Seleccione fecha</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fechaContrato"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fecha de Contrato</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Seleccione fecha</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="organizador"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organizador</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Escriba el nombre del organizador" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="direccion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dirección</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dirección del evento" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cliente"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cliente</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del cliente" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Email" {...field} type="email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="telefono"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-start">
                                        <FormLabel className="text-left">Teléfono</FormLabel>
                                        <FormControl className="w-full">
                                            <PhoneInput placeholder="Ingrese número de teléfono" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <CardFooter className="flex justify-between">
                                <Link href="/events">
                                    <Button variant="outline">Cancelar</Button>
                                </Link>
                                <Button>{!loading ? "Enviar" : <Spinner className="text-gray-200" />}</Button>
                            </CardFooter>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}