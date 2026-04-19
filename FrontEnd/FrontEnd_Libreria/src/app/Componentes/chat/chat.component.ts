import { ChangeDetectionStrategy, Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SignalrService } from '../../Servicios/signalr.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { responseAPIUsuario } from '../../Models/responseAPIUsuario';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { Usuario } from '../../interface/Usuario';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {

  messages: any[] = [];
  newMessage: string = '';
  filtroUsuario: string = '';
usuarioSeleccionado: Usuario | null = null;
private usuarioService = inject(UsuariosService);
public listaUsuarios = new MatTableDataSource<Usuario>();

  constructor(private chat: SignalrService, @Inject(PLATFORM_ID) private platformId: object) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.chat.startConnection();

      this.chat.mensajes$.subscribe(msg => {
       
        this.messages = [...this.messages, msg];
      });
    }
        this.obtenerUsuarios();

  }
   obtenerUsuarios() {
      this.usuarioService.listar().subscribe({
        next: (response: responseAPIUsuario<Usuario[]>) => {
          if (response.isSuccess) {
            this.listaUsuarios.data = response.data;
          } else {
            console.warn('La respuesta no fue exitosa:', response.message);
          }
        },
        error: (err: any) => {
          console.error('Error al cargar libros:', err.message);
        }
      });
    }
    listadoUsaurios(){
      this.usuarioService.listar().subscribe({
        next: (response: responseAPIUsuario<Usuario[]>) => {
          if (response.isSuccess) {
            this.listaUsuarios.data = response.data;
          } else {
            console.warn('La respuesta no fue exitosa:', response.message);
          }
        },
        error: (err: any) => {
          console.error('Error al cargar libros:', err.message);
        }
      });
    }
usuariosFiltrados(): Usuario[] {
  return this.listaUsuarios.data.filter(u =>
    u.nombre.toLowerCase().includes(this.filtroUsuario.toLowerCase())
  );
}

seleccionarUsuario(user: any) {
  this.usuarioSeleccionado = user;

  console.log('Usuario seleccionado:', user);
}
  enviarMensaje(): void {
    if (this.newMessage.trim() !== '') {
      this.chat.enviarMensaje(this.newMessage);
      this.newMessage = '';
    }
  }
}