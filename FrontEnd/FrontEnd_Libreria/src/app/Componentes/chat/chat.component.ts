import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { SignalrService } from '../../Servicios/signalr.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { responseAPIUsuario } from '../../Models/responseAPIUsuario';
import { UsuariosService } from '../../Servicios/usuarios.service';
import { Usuario } from '../../interface/Usuario';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnDestroy {

  messages: any[] = [];
  newMessage: string = '';
  filtroUsuario: string = '';
  usuarioSeleccionado: Usuario | null = null;
  listaUsuarios: Usuario[] = [];

  conectados$ = this.chat.conectados$;
  // Guardamos el ID del usuario logueado para excluirlo de la lista
  currentUserId = localStorage.getItem('userId');

  private destroy$ = new Subject<void>();
  private usuarioService = inject(UsuariosService);

  constructor(
    private chat: SignalrService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.chat.startConnection();

    this.chat.mensajes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        this.messages = [...this.messages, msg];
        this.cdr.markForCheck();
      });

    this.obtenerUsuarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chat.stopConnection();
  }

  obtenerUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (response: responseAPIUsuario<Usuario[]>) => {
        if (response.isSuccess) {
          this.listaUsuarios = response.data;
          this.cdr.markForCheck();
        } else {
          console.warn('La respuesta no fue exitosa:', response.message);
        }
      },
      error: (err: any) => {
        console.error('Error al cargar usuarios:', err.message);
      }
    });
  }

  usuariosFiltrados(): Usuario[] {
    return this.listaUsuarios.filter(u =>
      u.id !== this.currentUserId && // ← excluye tu propio usuario
      u.nombre.toLowerCase().includes(this.filtroUsuario.toLowerCase())
    );
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = usuario;
    this.cdr.markForCheck();
  }

  mensajesFiltrados(): any[] {
    if (!this.usuarioSeleccionado) return [];

    const destinoId = this.usuarioSeleccionado.id; // ← sin ?. porque ya verificamos arriba

    return this.messages.filter(m =>
      m.emisorId === destinoId ||
      m.usuarioDestinoId === destinoId
    );
  }

 enviarMensaje(): void {
  if (!this.newMessage.trim() || !this.usuarioSeleccionado) return;
  console.log('>>> Enviando a ID:', this.usuarioSeleccionado.id);
  this.chat.enviarMensaje({
    mensaje: this.newMessage,
    usuarioDestinoId: this.usuarioSeleccionado.id
  });
  this.newMessage = '';
}
}