export interface EdicionUsuariosAdminDTO {
  nombre: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  Admin: boolean;
  estado: boolean;
}
