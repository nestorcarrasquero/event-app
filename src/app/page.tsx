import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Control de Eventos</h1>
        <p className="text-muted-foreground">Organice sus eventos y mantenga un control de actividades, participantes e insumos</p>
      </header>
      <div className="flex justify-center mb-8">
        <Link href="/events/new">
          <Button size="lg" className="gap-2">
            <CalendarDays className="h-5 w-5" />
            Crear Evento
          </Button>
        </Link>
      </div>
      <div className="mt-12 text-center">
        <Link href="/events">
          <Button size="lg" className="gap-2" variant="outline">
            Ver Eventos
          </Button>
        </Link>
      </div>
    </div>
  );
}
