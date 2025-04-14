'use client'
import EventCard from "@/app/components/EventCard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

interface TypeProps {
    id: string,
    description: string
}

export default function NewEvent() {
    const [loading, setLoading] = useState(false)
    const [typeEvent, setTypeEvent] = useState<TypeProps[]>([])
    const router = useRouter();

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

    async function handleSubmit(data: z.infer<typeof FormSchema>) {
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
            const response = await fetchResponse.json()  
                     
            if (!response.message) {
                toast.error(response.error)
                throw new Error(response.error)
            }
            toast.success(response.message)
            form.reset()
        } catch (error: string | any) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="#" onClick={() => router.back()} className="inline-flex items-center gap-1 mb-6 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />Regresa a Página anterior
            </Link>
            <EventCard onSubmit={handleSubmit} form={form} loading={loading} typeEvent={typeEvent} />
        </div>
    )
}