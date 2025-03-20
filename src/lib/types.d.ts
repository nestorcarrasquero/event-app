export interface Tarea {
    id: string;
    nombre: string;
    completado: boolean;
}

export interface Gasto {
    id: string;
    descripcion: string;
    monto: number;
    categoria: string;
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
}

export interface IStaff {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    rol: string;
    skills: string[];
    assignedEvents: string[];
    availability: string[];
}