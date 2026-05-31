import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject,
  Inject, OnInit, OnDestroy, OnChanges, PLATFORM_ID,
  Output, EventEmitter, ViewChild, ElementRef, Input, SimpleChanges
} from '@angular/core';
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
export class ChatComponent implements OnInit, OnDestroy, OnChanges {

  messages: any[] = [];
  newMessage: string = '';
  filtroUsuario: string = '';
  usuarioSeleccionadoInterno: Usuario | null = null;
  listaUsuarios: Usuario[] = [];
  expandido = false;

  @Output() usuarioSeleccionado = new EventEmitter<Usuario>();
  @ViewChild('chatBody') chatBody!: ElementRef;

  // ← sin duplicados
  @Input() mostrarSoloChat: boolean = false;
  @Input() resetear: boolean = false;

  conectados$ = this.chat.conectados$;
  currentUserId = localStorage.getItem('userId');

  private destroy$ = new Subject<void>();
  private usuarioService = inject(UsuariosService);

  constructor(
    private chat: SignalrService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetear']?.currentValue === true) {
      this.usuarioSeleccionadoInterno = null;
      this.messages = [];
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.chat.startConnection();

    this.chat.mensajes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        this.messages = [...this.messages, msg];
        this.cdr.markForCheck();
        this.scrollToBottom();
      });

    this.obtenerUsuarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.chat.stopConnection();
  }

  toggleExpandir(): void {
    this.expandido = !this.expandido;
    this.cdr.markForCheck();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatBody?.nativeElement) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    }, 50);
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
      u.id !== this.currentUserId &&
      u.nombre.toLowerCase().includes(this.filtroUsuario.toLowerCase())
    );
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionadoInterno = usuario;
    this.usuarioSeleccionado.emit(usuario);

    this.chat.obtenerHistorial(usuario.id)
      .then(mensajes => {
        this.messages = mensajes;
        this.cdr.markForCheck();
        this.scrollToBottom();
      })
      .catch(err => console.error('Error cargando historial:', err));

    this.cdr.markForCheck();
  }

  mensajesFiltrados(): any[] {
    if (!this.usuarioSeleccionadoInterno) return [];
    const destinoId = this.usuarioSeleccionadoInterno.id;
    return this.messages.filter(m =>
      m.emisorId === destinoId ||
      m.usuarioDestinoId === destinoId
    );
  }

  enviarMensaje(): void {
    if (!this.newMessage.trim() || !this.usuarioSeleccionadoInterno) return;
    this.chat.enviarMensaje({
      mensaje: this.newMessage,
      usuarioDestinoId: this.usuarioSeleccionadoInterno.id
    });
    this.newMessage = '';
  }
}