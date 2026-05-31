import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalrService, MensajeChat } from '../../Servicios/signalr.service';
import { Subject, takeUntil } from 'rxjs';
import { AccesoService } from '../../Servicios/acceso.service';
import { MatIconModule } from "@angular/material/icon";
import { ChatComponent } from "../../Componentes/chat/chat.component";
import { Usuario } from '../../interface/Usuario';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ChatComponent],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWidgetComponent implements OnInit, OnDestroy {

  isOpen = false;
  isChatExpanded = false; // true cuando el usuario selecciona a alguien → ventana completa
  unreadCount = 0;
usuarioActivoNombre: string = '';
resetearChat: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private chatService: SignalrService,
    private accesoService: AccesoService,
    private cdr: ChangeDetectorRef, // necesario con OnPush
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.accesoService.isLoggedIn()) return;

    // La conexión SignalR la inicia el ChatComponent
    // aquí solo escuchamos para el contador de no leídos
    this.chatService.mensajes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.isOpen) {
          this.unreadCount++;
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;

    if (!this.isOpen) {
      // Al cerrar el globo, vuelve a la lista de usuarios
      this.isChatExpanded = false;
    }

    if (this.isOpen) {
      this.unreadCount = 0;
    }

    this.cdr.markForCheck();
  }

  // El ChatComponent emite este evento cuando el usuario pulsa en alguien
  onUsuarioSeleccionado(usuario: Usuario): void {
      this.usuarioActivoNombre = usuario.nombre;

    this.cdr.markForCheck();
  }

  // Botón de volver — regresa a la lista sin cerrar el chat
volverALista(): void {
  this.usuarioActivoNombre = '';
  this.resetearChat = true;         
  setTimeout(() => {
    this.resetearChat = false;      
    this.cdr.markForCheck();
  }, 50);
  this.cdr.markForCheck();
}
}