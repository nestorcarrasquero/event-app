'use client'
import EventCard from "@/app/components/EventCard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewEvent() {
    const router = useRouter();
    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="#" onClick={() => router.back()} className="inline-flex items-center gap-1 mb-6 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />Regresa a Página anterior
            </Link>
            <EventCard />
        </div>
    )
}