import EventCard from "@/app/components/EventCard";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewEvent() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/events" className="inline-flex items-center gap-1 mb-6 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />Regresa a Lista de Eventos
            </Link>
            <EventCard />
        </div>
    )
}