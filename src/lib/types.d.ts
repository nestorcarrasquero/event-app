export interface Task {
    id: string;
    name: string;
    completed: boolean;
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
}