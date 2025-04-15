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
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { isValidPhoneNumber } from "react-phone-number-input"
import { toast } from "sonner"
import { z } from "zod"
import { Spinner } from "./Spinner"

interface TypeProps {
    id: string,
    description: string
}

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
    roleId: z.string({
        required_error: "El rol es requerido",
    }),
    skills: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Debe seleccionar al menos un skill",
    }),
    /*assignedEvents: z.array(z.string()),*/
    availability: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Debe seleccionar al menos un día de disponibilidad",
    }),
})

export default function StaffForm() {
    const [dynamicHeight, setDynamicHeight] = useState(0)
    const [commonSkills, setCommonSkills] = useState<TypeProps[]>([])
    const [staffRoles, setStaffRoles] = useState([])
    const [days, setDays] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchSkills() {
            try {
                const res = await fetch('/api/skill')
                const result = await res.json()
                const data = await result.map((x: TypeProps) => {
                    return {
                        id: String(x.id),
                        description: x.description
                    }
                })
                setCommonSkills(data)
            } catch (error) {
                return error
            }
        }
        async function fetchStaff() {
            try {
                const res = await fetch('/api/role')
                const result = await res.json()
                const data = await result.map((x: TypeProps) => {
                    return {
                        id: String(x.id),
                        description: x.description
                    }
                })
                setStaffRoles(data)
            } catch (error) {
                return error
            }
        }
        async function fetchDays() {
            try {
                const res = await fetch('/api/availability')
                const result = await res.json()
                const data = await result.map((x: { id: string, day: string }) => {
                    return {
                        id: String(x.id),
                        day: x.day
                    }
                })
                setDays(data)
            } catch (error) {
                return error
            }
        }
        fetchSkills()
        fetchStaff()
        fetchDays()
    }, [])

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nombre: "",
            email: "",
            telefono: "",
            roleId: "",
            skills: [],
            /*assignedEvents: [],*/
            availability: [],
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
            const fetchResponse = await fetch('/api/staff', settings)
            const response = await fetchResponse.json()
            if(!response.message) {
                toast.error(response.error)
                throw new Error(response.error)
            }
            toast.success(response.message)
            form.reset()
        } catch (error) {
            console.error('Error submitting staff: ', error);
        } finally {
            setLoading(false)
        }
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-[500px] shadow-2xl mx-auto">
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
                                name="roleId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rol</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} key={`role-${field.value}`}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione el rol" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent position="popper">
                                                {
                                                    staffRoles.map((role: TypeProps) => (
                                                        <SelectItem value={role.id} key={role.id}>{role.description}</SelectItem>
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
                                name="availability"
                                render={() => (
                                    <FormItem>
                                        <div className="mb-4">
                                            <FormLabel>Disponibilidad</FormLabel>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {days.map((item: { id: string, day: string }) => (
                                                <FormField
                                                    key={item.id}
                                                    control={form.control}
                                                    name="availability"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={item.id}
                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, item.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== item.id
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-sm font-normal">
                                                                    {item.day}
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
                                                <FormControl style={{ minHeight: `${dynamicHeight}px` }}>
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
                                                                    <div key={i} className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium">{commonSkills.find((sk: TypeProps) => sk.id === val)?.description}</div>
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
                                                            {commonSkills.map((language: TypeProps) => (
                                                                <CommandItem
                                                                    value={language.id}
                                                                    key={language.id}
                                                                    onSelect={() => {
                                                                        handleSetValue(language.id)
                                                                    }}
                                                                >
                                                                    {language.description}
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            form.getValues("skills").includes(language.id) ? "opacity-100" : "opacity-0"
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
                                <Button>{!loading ? "Enviar" : <Spinner className="text-gray-200" />}</Button>
                            </CardFooter>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}