import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { ChatGrupal } from '../interface/ChatGrupal';
import { Grupo } from '../interface/Grupo';

export interface MensajeChat {
  emisorId: string;
  usuarioDestinoId: string;
  nombre: string;
  mensaje: string;
  fecha: string;
}

@Injectable({ providedIn: 'root' })
export class SignalrService {

  private hubConnection!: signalR.HubConnection;

  // ── Privado: sin cambios ──
  private mensajeSubject = new Subject<MensajeChat>();
  mensajes$ = this.mensajeSubject.asObservable();

  private conectadosSubject = new BehaviorSubject<Set<string>>(new Set());
  conectados$ = this.conectadosSubject.asObservable();

  // ── Grupal ──
  private mensajeGrupoSubject = new Subject<ChatGrupal>();
  mensajesGrupo$ = this.mensajeGrupoSubject.asObservable();
  private grupoActualId: string | null = null;

  startConnection(): void {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7105/chat', {
        accessTokenFactory: () => localStorage.getItem('token') ?? ''
      })
      .withAutomaticReconnect()
      .build();

    // ── Chat Privado ──
    this.hubConnection.on('RecibirMensaje', (data: MensajeChat) => {
      this.mensajeSubject.next(data);
    });

    this.hubConnection.on('UsuarioConectado', (userId: string) => {
      const actual = new Set(this.conectadosSubject.value);
      actual.add(userId);
      this.conectadosSubject.next(actual);
    });

    this.hubConnection.on('UsuarioDesconectado', (userId: string) => {
      const actual = new Set(this.conectadosSubject.value);
      actual.delete(userId);
      this.conectadosSubject.next(actual);
    });

    // ── Grupal ──
    this.hubConnection.on('RecibirMensajeGrupo', (data: ChatGrupal) => {
      this.mensajeGrupoSubject.next(data);
    });

    this.hubConnection.onreconnected(async () => {
      const conectados = await this.hubConnection.invoke<string[]>('ObtenerConectados');
      this.conectadosSubject.next(new Set(conectados));

      if (this.grupoActualId) {
        await this.hubConnection.invoke('UnirseGrupo', { grupoId: this.grupoActualId });
      }
    });

    this.hubConnection.start()
      .then(async () => {
        const conectados = await this.hubConnection.invoke<string[]>('ObtenerConectados');
        this.conectadosSubject.next(new Set(conectados));
      })
      .catch(err => console.error('❌ Error SignalR:', err));
  }

  // ── Chat Privado ──
  obtenerHistorial(otroUsuarioId: string): Promise<any[]> {
    return this.hubConnection.invoke<any[]>('ObtenerHistorial', otroUsuarioId);
  }

  enviarMensaje(data: { mensaje: string; usuarioDestinoId: string }): void {
    if (!this.hubConnection) return;
    this.hubConnection.invoke('EnviarMensajePrivado', data.usuarioDestinoId, data.mensaje)
      .catch(err => console.error(err));
  }

  // ── Grupal ──
  async unirseGrupo(grupoId: string): Promise<void> {
    this.grupoActualId = grupoId;
    await this.hubConnection.invoke('UnirseGrupo', { grupoId });
  }

  async salirGrupo(grupoId: string): Promise<void> {
    if (this.grupoActualId === grupoId) this.grupoActualId = null;
    await this.hubConnection.invoke('SalirGrupo', grupoId);
  }

  obtenerHistorialGrupo(grupoId: string): Promise<ChatGrupal[]> {
    return this.hubConnection.invoke<ChatGrupal[]>('ObtenerHistorialGrupo', grupoId);
  }

  enviarMensajeGrupo(grupoId: string, mensaje: string): void {
    this.hubConnection.invoke('EnviarMensajeGrupo', grupoId, mensaje).catch(err => console.error(err));
  }

  obtenerMisGrupos(): Promise<Grupo[]> {
    return this.hubConnection.invoke<Grupo[]>('ObtenerMisGrupos');
  }

  crearGrupo(nombre: string, descripcion?: string): Promise<string> {
    return this.hubConnection.invoke<string>('CrearGrupo', nombre, descripcion ?? null);
  }

  
  stopConnection(): void {
    this.hubConnection?.stop()
      .then(() => console.log('🔌 SignalR desconectado'))
      .catch(err => console.error(err));
  }
}