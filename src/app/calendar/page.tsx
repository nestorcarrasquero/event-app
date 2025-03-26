'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Event, IStaff } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight, DollarSign, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const initialStaff: IStaff[] = [
    {
        id: "1",
        nombre: "Alex Johnson",
        email: "alex.johnson@example.com",
        telefono: "555-123-4567",
        rol: "Event Coordinator",
        skills: ["Setup", "Coordination", "Customer Service"],
        assignedEvents: ["1"],
        availability: ["martes", "miercoles", "jueves", "viernes", "sabado", "domingo"],
    },
    {
        id: "2",
        nombre: "Morgan Smith",
        email: "morgan.smith@example.com",
        telefono: "555-987-6543",
        rol: "Technical Support",
        skills: ["AV Equipment", "Lighting", "Sound Systems"],
        assignedEvents: ["2"],
        availability: ["lunes", "martes", "miercoles", "jueves", "sabado"],
    },
    {
        id: "3",
        nombre: "Jamie Wilson",
        email: "jamie.wilson@example.com",
        telefono: "555-456-7890",
        rol: "Logistics Manager",
        skills: ["Inventory", "Transportation", "Vendor Management"],
        assignedEvents: ["1", "2"],
        availability: ["lunes", "martes", "miercoles", "jueves", "viernes", "domingo"],
    },
]

const initialEvents: Event[] = [
    {
        id: "1",
        titulo: "Evento uno",
        fechaEvento: new Date("2025-03-10"),
        fechaContrato: new Date("2025-03-10"),
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
        fechaEvento: new Date("2025-03-15"),
        fechaContrato: new Date("2025-03-15"),
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
]

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState<Event[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | null>()
    const [selectedEvents, setSelectedEvents] = useState([])
    const [staffFilter, setStaffFilter] = useState("all")

    useEffect(() => {
        // In a real app, this would be an API call
        setEvents(initialEvents)
    }, [])

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }

    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay()
    }

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    // Generate calendar days
    const calendarDays = []

    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push({ day: null, events: [] })
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)

        // Find events for this day
        const dayEvents = events.filter((event) => {
            const eventDate = new Date(event.fechaEvento)
            return (
                eventDate.getDate() === day &&
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year &&
                (staffFilter === "all" || event.staff.includes(staffFilter))
            )
        })

        calendarDays.push({ day, date, events: dayEvents })
    }

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
        setSelectedDate(null)
        setSelectedEvents([])
    }

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
        setSelectedDate(null)
        setSelectedEvents([])
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDateClick = (day: any) => {
        console.log(day)
        if (!day.day) return

        setSelectedDate(day.date)
        setSelectedEvents(day.events)
    }

    const monthName = currentDate.toLocaleString("default", { month: "long" })

    return (
        <div className="container mx-auto px-4 py-8">
            <div>
                <div>
                    <h1 className="text-3xl font-bold">Calendario de Eventos</h1>
                    <p className="text-muted-foreground">Para ver y manejar los eventos programados</p>
                </div>
                <div>

                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {monthName} {year}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={previousMonth}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={nextMonth}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-7 gap-1">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                                    <div key={index} className="text-center font-medium text-sm py-2">
                                        {day}
                                    </div>
                                ))}

                                {calendarDays.map((day, index) => (
                                    <div
                                        key={index}
                                        className={cn(
                                            "min-h-[100px] p-1 border rounded-md",
                                            day.day ? "cursor-pointer hover:bg-secondary/50" : "bg-muted/20",
                                            selectedDate &&
                                                day.day &&
                                                selectedDate.getDate() === day.day &&
                                                selectedDate.getMonth() === month &&
                                                selectedDate.getFullYear() === year
                                                ? "bg-primary/10 border-primary"
                                                : "",
                                        )}
                                        onClick={() => handleDateClick(day)}
                                    >
                                        {day.day && (
                                            <>
                                                <div className="text-right text-sm font-medium p-1">{day.day}</div>
                                                <div className="space-y-1">
                                                    {day.events.map((event, eventIndex) => (
                                                        <div
                                                            key={eventIndex}
                                                            className="text-xs p-1 rounded bg-primary/10 truncate"
                                                            title={event.titulo}
                                                        >
                                                            {event.titulo}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>
                                {selectedDate ? formatDate(selectedDate) : "Detalles del Evento"}
                            </CardTitle>
                            <CardDescription>
                                {selectedDate
                                    ? `${selectedEvents.length} evento${selectedEvents.length !== 1 ? "s" : ""} en el calendario`
                                    : "Seleccione una fecha para ver los eventos programados"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!selectedDate ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">Haga clic en una fecha del calendario para ver los eventos programados</p>
                                </div>
                            ) : selectedEvents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <p className="text-muted-foreground mb-4">No events scheduled for this date</p>
                                    <Link href="/events/new">
                                        <Button>Add Event</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedEvents.map((event: Event) => (
                                        <Link href={`/events/${event.id}`} key={event.id}>
                                            <div className="p-4 border rounded-md hover:bg-secondary/50 cursor-pointer">
                                                <h3 className="font-medium">{event.titulo}</h3>
                                                <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        <span className="truncate">{event.direccion}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        <span>{event.organizador}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="h-3 w-3" />
                                                        <span>${event.gastos.reduce((sum, expense) => sum + expense.monto, 0).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {event.tareas.filter((t) => t.completado).length} de {event.tareas.length} tareas completadas
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Link>
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