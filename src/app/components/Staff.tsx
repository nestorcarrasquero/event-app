import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IStaff } from "@/lib/types"
import { Calendar, Mail, Phone } from "lucide-react"
import Link from "next/link"

interface Props {
    staffs: IStaff[] | undefined
}

export default function Staff({ staffs }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
                staffs && staffs.map((stf) => (
                    <Link href={`/staff/${stf.id}`} key={stf.id} className="cursor-pointer">
                        <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle>{stf.nombre}</CardTitle>
                                <Badge variant="outline" className="w-fit">
                                    {stf.rol}
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{stf.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{stf.telefono}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {stf.assignedEvents.length} event{stf.assignedEvents.length !== 1 ? "s" : ""} assigned
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {stf.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="text-xs text-muted-foreground">
                                    Available:{" "}
                                    {stf.availability
                                        .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1, 3))
                                        .join(", ")}
                                </div>
                            </CardFooter>
                        </Card>
                    </Link>
                ))
            }
        </div>
    )
}