export interface Usuario {
    nombre: string;
    email: string;
    password: string;
    Admin: boolean;
    fechaRegistro: Date;   
    fechaBaja?: Date;
    estado: boolean;

}