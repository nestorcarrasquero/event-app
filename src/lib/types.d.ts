export interface Tarea {
    id: string;
    nombre: string;
    completado: boolean;
}

export interface Gasto {
    id: string;
    descripcion: string;
    monto: number;
    category: Category;
    fecha: Date;
    responsable: string;
}

export interface Event {
    id: string;
    titulo: string;
    fechaEvento: Date;
    fechaContrato: Date;
    organizador: string;
    direccion: string;
    cliente: string;
    email: string;
    telefono: string;
    tareas: Tarea[];
    gastos: Gasto[];
    staff: IStaff[];
    typeEvent: TypeEvent;
}

export interface IStaff {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    role: Role;
    skills: Skill[];
    events: Event[];
    availability: Availability[];
}

export interface TypeEvent {
    id: string;
    description: string;
}

export interface Skill {
    id: string;
    description: string;
}

export interface Availability {
    id: string;
    day: string;
}

export interface Category {
    id: string;
    description: string;
}

export interface Role {
    id: string;
    description: string;
}