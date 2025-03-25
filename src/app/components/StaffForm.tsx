'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CommandInput, Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { isValidPhoneNumber } from "react-phone-number-input"
import { toast } from "sonner"
import { z } from "zod"

const FormSchema = z.object({
    nombre: z.string().min(2, {
        message: "El nombre debe tener al menos 2 caracteres"
    }),
    email: z.string().min(2, {
        message: "El email debe tener al menos 2 caracteres"
    }).email({
        message: "El email debe ser válido"
    }),
    telefono: z
        .string()
        .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    rol: z.string().min(2, {
        message: "El nombre debe tener al menos 2 caracteres"
    }),
    skills: z.array(z.string()),
    /*assignedEvents: z.array(z.string()),*/
    availability: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
})

const days = [
    {
        id: "lunes",
        label: "Lunes",
    },
    {
        id: "martes",
        label: "Martes",
    },
    {
        id: "miercoles",
        label: "Miercoles",
    },
    {
        id: "jueves",
        label: "Jueves",
    },
    {
        id: "viernes",
        label: "Viernes",
    },
    {
        id: "sabado",
        label: "Sabado",
    },
    {
        id: "domingo",
        label: "Domingo",
    },
] as const

const staffRoles = [
    "Event Coordinator",
    "Technical Support",
    "Logistics Manager",
    "Security Personnel",
    "Catering Staff",
    "Registration Assistant",
    "Venue Manager",
    "AV Technician",
    "Transportation Coordinator",
    "Cleaning Staff",
]

// Common staff skills
const commonSkills = [
    "Setup",
    "Coordination",
    "Customer Service",
    "AV Equipment",
    "Lighting",
    "Sound Systems",
    "Inventory",
    "Transportation",
    "Vendor Management",
    "Security",
    "First Aid",
    "Food Service",
    "Registration",
    "Cleaning",
    "Photography",
]

export default function StaffForm() {
    const [dynamicHeight, setDynamicHeight] = useState(0)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nombre: "",
            email: "",
            telefono: "",
            rol: "",
            skills: [],
            /*assignedEvents: [],*/
            availability: [],
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast("You submitted the following values:", {
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            )
        })
    }

    const handleSetValue = (val: string) => {
        const currentSkills = form.getValues("skills");
        const value = [...currentSkills];
        if (currentSkills.includes(val)) {
            value.splice(value.indexOf(val), 1);
            form.setValue("skills", value.filter((item) => item !== val));
        } else {
            form.setValue("skills", [...value, val]);
        }
        const height = Math.max(5, 5 + (currentSkills.length * 20))  
        setDynamicHeight(height)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[500px] shadow-2xl max-h-[600px] overflow-y-auto mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Registrar Staff</CardTitle>
                        <CardDescription>Ingrese los datos necesarios para registrar personal</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ingrese nombre" {...field} />
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
                            <FormField
                                control={form.control}
                                name="rol"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rol</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione el rol" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent position="popper">
                                                {staffRoles.map((role, index) => (
                                                    <SelectItem value={role} key={index}>{role}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="availability"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel>Disponibilidad</FormLabel>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {days.map((day) => (
                                                <FormField
                                                    key={day.id}
                                                    control={form.control}
                                                    name="availability"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={day.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(day.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, day.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== day.id
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">
                                                                    {day.label}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="skills"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Skills</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl style={{minHeight: `${dynamicHeight}px`}}>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <div className="grid grid-cols-3 gap-2 justify-start">
                                                            {form.getValues("skills")?.length ?
                                                                form.getValues("skills").map((val, i) => (
                                                                    <div key={i} className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium">{commonSkills.find((framework) => framework === val)}</div>
                                                                ))
                                                                : "Select skill..."}
                                                        </div>
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search skill..."
                                                        className="h-9"
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>No skill found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {commonSkills.map((language) => (
                                                                <CommandItem
                                                                    value={language}
                                                                    key={language}
                                                                    onSelect={() => {
                                                                        handleSetValue(language)
                                                                    }}
                                                                >
                                                                    {language}
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            form.getValues("skills").includes(language) ? "opacity-100" : "opacity-0"
                                                                        )} />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <CardFooter className="flex justify-between">
                                <Link href="/staff">
                                    <Button variant="outline">Cancelar</Button>
                                </Link>
                                <Button>Enviar</Button>
                            </CardFooter>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}