'use client'
import { Button } from "@/components/ui/button";
import { IStaff } from "@/lib/types";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Staff from "../components/Staff";
import { Spinner } from "../components/Spinner";

export default function StaffPage() {
    const [staff, setStaff] = useState<IStaff[]>([])

    useEffect(() => {
        async function fetchStaff() {
            try {
                const res = await fetch('/api/staff')
                const result = await res.json()
                setStaff(result)
            } catch (error) {
                return error
            }
        }
        fetchStaff()        
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center gap-1 mb-6 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />Regresa a Página Principal
            </Link>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Staff</h1>
                <Link href="/staff/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Incluir
                    </Button>
                </Link>
            </div>
            {
                staff.length === 0 ? (
                    <div className="text-center py-12">
                        <Spinner />
                        <p className="text-muted-foreground mb-4">No hay personal registrado</p>
                        <Link href="/events/new">
                            <Button className="gap-2">Incluir</Button>
                        </Link>
                    </div>
                ) : (
                    <Staff staffs={staff} />
                )
            }
        </div>
    )
}