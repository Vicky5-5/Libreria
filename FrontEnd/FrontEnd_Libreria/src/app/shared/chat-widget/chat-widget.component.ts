
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SignalrService } from '../../Servicios/signalr.service';
import { AccesoService } from '../../Servicios/acceso.service';

import { Subject, takeUntil } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';

import { ChatComponent } from '../../Componentes/chat/chat.component';
import { ChatGrupoComponent } from '../../Componentes/chat/ChatGrupoComponent/ChatGrupoComponent';

import { Usuario } from '../../interface/Usuario';
import { Grupo } from '../../interface/Grupo';

type Modo = 'privado' | 'grupal';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    ChatComponent,
    ChatGrupoComponent
  ],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWidgetComponent implements OnInit, OnDestroy {

  isOpen = false;
  isChatExpanded = false;

  modo: Modo = 'privado';

  unreadPrivado = 0;
  unreadGrupal = 0;

  usuarioActivoNombre = '';
  grupoActivoNombre = '';
  grupoActivoId = '';

  resetearChat = false;
  resetearChatGrupal = false;

  private destroy$ = new Subject<void>();

  constructor(
    private chatService: SignalrService,
    private accesoService: AccesoService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  get unreadCount(): number {
    return this.unreadPrivado + this.unreadGrupal;
  }

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.accesoService.isLoggedIn()) {
      return;
    }

    // Iniciar SignalR
    this.chatService.startConnection();

    // Mensajes privados
    this.chatService.mensajes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {

        if (
          this.isOpen &&
          this.modo === 'privado'
        ) {
          return;
        }

        this.unreadPrivado++;

        this.cdr.markForCheck();
      });

    // Mensajes grupales
    this.chatService.mensajesGrupo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {

        if (
          this.isOpen &&
          this.modo === 'grupal' &&
          this.grupoActivoId === msg.grupoId
        ) {
          return;
        }

        this.unreadGrupal++;

        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {

    this.chatService.stopConnection();

    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleChat(): void {

    this.isOpen = !this.isOpen;

    if (!this.isOpen) {
      this.isChatExpanded = false;
    }

    if (this.isOpen) {

      if (this.modo === 'privado') {
        this.unreadPrivado = 0;
      } else {
        this.unreadGrupal = 0;
      }
    }

    this.cdr.markForCheck();
  }

  cambiarModo(modo: Modo): void {

    // No permitir cambiar de pestaña mientras hay
    // una conversación abierta.
    if (
      this.usuarioActivoNombre ||
      this.grupoActivoNombre
    ) {
      return;
    }

    this.modo = modo;

    if (modo === 'privado') {
      this.unreadPrivado = 0;
    } else {
      this.unreadGrupal = 0;
    }

    this.cdr.markForCheck();
  }

  onUsuarioSeleccionado(usuario: Usuario): void {

    this.usuarioActivoNombre = usuario.nombre;

    this.cdr.markForCheck();
  }

  onGrupoSeleccionado(grupo: Grupo): void {

    this.grupoActivoId = grupo.id;
    this.grupoActivoNombre = grupo.nombre;

    this.unreadGrupal = 0;

    this.cdr.markForCheck();
  }

  volverALista(): void {

    this.usuarioActivoNombre = '';
    this.grupoActivoNombre = '';
    this.grupoActivoId = '';

    this.resetearChat = true;
    this.resetearChatGrupal = true;

    this.cdr.markForCheck();

    setTimeout(() => {

      this.resetearChat = false;
      this.resetearChatGrupal = false;

      this.cdr.markForCheck();

    }, 50);
  }

  crearGrupo(): void {

    this.router.navigate([
      '/nuevo-grupo'
    ]);
  }
}

