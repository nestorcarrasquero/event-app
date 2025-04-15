'use client'
import { Spinner } from "@/app/components/Spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Event, IStaff } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Calendar, ChevronLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function StaffDetail() {
    const params = useParams<{ id: string }>();
    const { id } = params
    const [staff, setStaff] = useState<IStaff>()
    const [events, setEvents] = useState<Event[]>([])
    const [assignedEvents, setAssignedEvents] = useState<Event[]>([])
    const [unassignedEvents, setUnassignedEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(false)

    const fetchStaff = useCallback(async () => {
        try {
            const response = await fetch(`/api/staff/${id}`)
            const data = await response.json()
            setStaff(data)
        } catch (error) {
            return error
        }            
    }, [id])

    const fetchEvents = useCallback(async () => {
        try {
            const res = await fetch('/api/event')
            const result = await res.json()
            setEvents(result)
        } catch (error) {
            return error
        }
    }, [])

    useEffect(() => {
        fetchStaff()
        fetchEvents()        
    }, [fetchStaff, fetchEvents])

    useEffect(() => {
        if (staff) {
            setAssignedEvents(staff.events)
            setUnassignedEvents(events.filter((e) => !staff.events.map((s) => s.id).includes(e.id)))
        } 
    }, [staff, events])

    if (!staff) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>
    } 

    const assignToEvent = async (eventId: string, assign: string) => {
        if (eventId == "") return
        setLoading(true)
        const settings = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assign: assign,
                eventId: eventId,
            }),
        }
        try {
            const fetchResponse = await fetch(`/api/staff/${id}`, settings)
            const response = await fetchResponse.json()

            if(!response.message) {
                toast.error(response.error)
                throw new Error(response.error)
            }
            toast.success(response.message)
            fetchStaff()
            fetchEvents()
        } catch (error) {
            console.error('Error submitting event: ', error)
        }  finally {
            setLoading(false)
        }     
    }   

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/staff" className="inline-flex items-center gap-1 mb-6 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />Regresa a Lista de Staff
            </Link>
            { loading ? <Spinner /> : null}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div>
                                <CardTitle>{staff.nombre}</CardTitle>
                                <CardDescription>{staff.role.description}</CardDescription>
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
                                                {staff.events.length} evento{staff.events.length !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium mb-2">Skills</div>
                                    <div className="flex flex-wrap gap-1">
                                        {staff.skills.map((skill, index) => (
                                            <Badge key={index} variant="secondary">
                                                {skill.description}
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
                                                    {day.day.charAt(0).toUpperCase() + day.day.slice(1)}
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
                                            <Button variant="outline" size="sm" onClick={() => assignToEvent(event.id, 'false')}>
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
                                            <Button variant="outline" size="sm" onClick={() => assignToEvent(event.id, 'true')}>
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