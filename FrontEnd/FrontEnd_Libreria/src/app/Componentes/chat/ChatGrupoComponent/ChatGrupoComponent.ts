import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, OnDestroy, OnChanges,
  PLATFORM_ID, Output, EventEmitter, ViewChild, ElementRef, Input, SimpleChanges
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { SignalrService } from '../../../Servicios/signalr.service';
import { Grupo } from '../../../interface/Grupo';
import { ChatGrupal } from '../../../interface/ChatGrupal';
import { MiembroGrupo } from '../../../interface/MiembroGrupo';

import { Subject, takeUntil, switchMap, tap, of } from 'rxjs';

@Component({
  selector: 'app-chat-grupo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './chatGrupoComponent.html',
  styleUrl: './chatGrupoComponent.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatGrupoComponent implements OnInit, OnDestroy, OnChanges {

  messages: ChatGrupal[] = [];
  newMessage = '';
  filtroGrupo = '';

  grupoSeleccionadoInterno: Grupo | null = null;
  listaGrupos: Grupo[] = [];
  miembros: MiembroGrupo[] = [];

  @Output() grupoSeleccionado = new EventEmitter<Grupo>();
  @Output() admin = new EventEmitter<boolean>();
  @Output() grupoCerrado = new EventEmitter<void>();
  @Output() gestionarMiembros = new EventEmitter<void>();

  conectados = new Set<string>();
  verMiembros = false;
  @ViewChild('chatBody') chatBody!: ElementRef;

  @Input() mostrarSoloChat = false;
  @Input() resetear = false;

  currentUserId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private chat: SignalrService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  get esAdmin(): boolean {
    return this.miembros.some(m => m.yo && m.admin);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetear']?.currentValue === true) {
      if (this.grupoSeleccionadoInterno) {
        this.chat.salirGrupo(this.grupoSeleccionadoInterno.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({ error: err => console.error('Error al salir del grupo:', err) });
      }
      this.grupoSeleccionadoInterno = null;
      this.messages = [];
      this.miembros = [];
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.currentUserId = localStorage.getItem('userId');

    this.chat.mensajesGrupo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        if (this.grupoSeleccionadoInterno && msg.grupoId === this.grupoSeleccionadoInterno.id) {
          this.messages = [...this.messages, msg];
          this.cdr.markForCheck();
          this.scrollToBottom();
        }
      });

    // Me añadieron a un grupo: aparece en la lista sin recargar
    this.chat.agregadoAGrupo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(grupo => {
        if (!this.listaGrupos.some(g => g.id === grupo.id)) {
          this.listaGrupos = [...this.listaGrupos, grupo];
          this.cdr.markForCheck();
        }
      });

    // Me quitaron de un grupo
    this.chat.eliminadoDeGrupo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(grupoId => {
        this.listaGrupos = this.listaGrupos.filter(g => g.id !== grupoId);
        if (this.grupoSeleccionadoInterno?.id === grupoId) {
          this.grupoCerrado.emit();   // el widget vuelve a la lista
        }
        this.cdr.markForCheck();
      });

    // Quién está conectado ahora mismo
    this.chat.conectados$
      .pipe(takeUntil(this.destroy$))
      .subscribe(set => {
        this.conectados = set;
        this.cdr.markForCheck();
      });

    // Me hicieron admin, o me quitaron el rol
    this.chat.rolGrupoCambiado$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ grupoId, admin }) => {
        this.listaGrupos = this.listaGrupos.map(g => g.id === grupoId ? { ...g, admin } : g);
        if (this.grupoSeleccionadoInterno?.id === grupoId) {
          this.cargarMiembros();      // vuelve a emitir (admin) al widget
        }
        this.cdr.markForCheck();
      });

    this.obtenerGrupos();
  }

  ngOnDestroy(): void {
    // Sin takeUntil a propósito: destroy$ está por emitir y cancelaría el pedido
    if (this.grupoSeleccionadoInterno) {
      this.chat.salirGrupo(this.grupoSeleccionadoInterno.id)
        .subscribe({ error: err => console.error('Error al salir del grupo:', err) });
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatBody?.nativeElement) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    }, 50);
  }

  obtenerGrupos(): void {
    this.chat.obtenerMisGrupos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: grupos => {
          this.listaGrupos = grupos;
          this.cdr.markForCheck();
        },
        error: err => console.error('Error al cargar grupos:', err)
      });
  }
  miembrosEnLinea(): number {
    return this.miembros.filter(m => this.conectados.has(m.id)).length;
  }
  gruposFiltrados(): Grupo[] {
    return this.listaGrupos.filter(g =>
      g.nombre.toLowerCase().includes(this.filtroGrupo.toLowerCase())
    );
  }

  gruposAdmin(): number {
    return this.listaGrupos.filter(g => g.admin).length;
  }

  seleccionarGrupo(grupo: Grupo): void {
    const debeSalirPrimero =
      this.grupoSeleccionadoInterno && this.grupoSeleccionadoInterno.id !== grupo.id;

    const salir$ = debeSalirPrimero
      ? this.chat.salirGrupo(this.grupoSeleccionadoInterno!.id)
      : of(undefined);

    salir$
      .pipe(
        tap(() => {
          this.grupoSeleccionadoInterno = grupo;
          this.grupoSeleccionado.emit(grupo);
          this.admin.emit(false);        // hasta saber si lo soy, no mostrar el botón
          this.messages = [];
          this.miembros = [];
          this.cdr.markForCheck();
          this.cargarMiembros();         // al llegar, emite el valor real de admin
        }),
        switchMap(() => this.chat.unirseGrupo(grupo.id)),
        switchMap(() => this.chat.obtenerHistorialGrupo(grupo.id)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: historial => {
          this.messages = historial;
          this.cdr.markForCheck();
          this.scrollToBottom();
        },
        error: err => console.error('Error cargando grupo:', err)
      });
  }

  enviarMensaje(): void {
    if (!this.newMessage.trim() || !this.grupoSeleccionadoInterno) return;

    const texto = this.newMessage;
    this.newMessage = '';

    this.chat.enviarMensajeGrupo(this.grupoSeleccionadoInterno.id, texto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({ error: err => console.error('Error al enviar:', err) });
  }

  // Lo necesita el widget para saber si mostrar el botón "Gestionar miembros"
  cargarMiembros(): void {
    if (!this.grupoSeleccionadoInterno) return;

    this.chat.obtenerMiembrosGrupo(this.grupoSeleccionadoInterno.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: miembros => {
          this.miembros = miembros;
          this.admin.emit(this.esAdmin);
          this.cdr.markForCheck();
        },
        error: err => console.error('Error al cargar miembros:', err)
      });
  }
}