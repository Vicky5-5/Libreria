export interface Usuario {
    id?: string;
    nombre: string;
    email: string;
    password: string;
    Admin: boolean;
    fechaRegistro: Date;   
    fechaBaja?: Date;
    estado: boolean;

}