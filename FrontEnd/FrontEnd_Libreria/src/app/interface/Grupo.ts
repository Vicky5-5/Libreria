export interface Grupo {
  id: string;
  nombre: string;
  descripcion?: string;
  creadorId?: string;
  admin?: boolean;   // soy admin de este grupo
}