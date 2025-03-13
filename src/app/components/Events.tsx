import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Event } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { CalendarDays, MapPin, Users } from "lucide-react"
import Link from "next/link"

interface Props {
    events: Event[] | undefined
}

export default function Events({ events }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events && events.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id} className="cursor-pointer">
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle>{event.titulo}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-2">
                                <CalendarDays className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <span>{formatDate(event.fechaEvento)}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{event.direccion}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <span>{event.organizador}</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}