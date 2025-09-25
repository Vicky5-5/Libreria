export interface Usuario {
    nombre: string;
    correo: string;
    password: string;
    Admin: boolean;
    fechaRegistro: Date;   
    fechaBaja?: Date;
    estado: boolean;

}