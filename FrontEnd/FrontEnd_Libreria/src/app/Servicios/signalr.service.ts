// signalr.service.ts
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject, Observable, defer, from } from 'rxjs';
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
  private startPromise: Promise<void> | null = null;

  // ── Chat Privado ──
  private mensajeSubject = new Subject<MensajeChat>();
  mensajes$ = this.mensajeSubject.asObservable();

  private conectadosSubject = new BehaviorSubject<Set<string>>(new Set());
  conectados$ = this.conectadosSubject.asObservable();

  // ── Grupal ──
  private mensajeGrupoSubject = new Subject<ChatGrupal>();
  mensajesGrupo$ = this.mensajeGrupoSubject.asObservable();
  private grupoActualId: string | null = null;

  // ── Conexión ──
  private buildConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7105/chat', {
        accessTokenFactory: () => localStorage.getItem('token') ?? ''
      })
      .withAutomaticReconnect()
      .build();

    // Chat Privado
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

    // Grupal
    this.hubConnection.on('RecibirMensajeGrupo', (data: ChatGrupal) => {
      this.mensajeGrupoSubject.next(data);
    });

    // Tras una reconexión cambia el ConnectionId: hay que volver a unirse al grupo
    this.hubConnection.onreconnected(async () => {
      const conectados = await this.hubConnection.invoke<string[]>('ObtenerConectados');
      this.conectadosSubject.next(new Set(conectados));

      if (this.grupoActualId) {
        await this.hubConnection.invoke('UnirseGrupo', { grupoId: this.grupoActualId });
      }
    });
  }

  startConnection(): Promise<void> {
    const S = signalR.HubConnectionState;
    const state = this.hubConnection?.state;

    if (state === S.Connected) return Promise.resolve();
    if (this.startPromise) return this.startPromise;                  // ya hay un start en curso
    if (state && state !== S.Disconnected) return Promise.resolve();  // Connecting / Reconnecting

    this.buildConnection();

    this.startPromise = this.hubConnection.start()
      .then(async () => {
        console.log('✅ SignalR conectado');
        const conectados = await this.hubConnection.invoke<string[]>('ObtenerConectados');
        this.conectadosSubject.next(new Set(conectados));
      })
      .catch(err => console.error('❌ Error SignalR:', err))
      .finally(() => { this.startPromise = null; });

    return this.startPromise;
  }

  // Espera a que la conexión esté lista; si está caída, la reabre
  private async ensureConnected(): Promise<void> {
    await this.startConnection();

    const S = signalR.HubConnectionState;
    for (let i = 0; i < 50; i++) { // hasta ~5s
      const s = this.hubConnection?.state;
      if (s !== S.Connecting && s !== S.Reconnecting) break;
      await new Promise(r => setTimeout(r, 100));
    }

    if (this.hubConnection?.state !== S.Connected) {
      throw new Error('No se pudo establecer la conexión con el servidor.');
    }
  }

  // Observable frío: no hace nada hasta el .subscribe()
  private invoke$<T>(metodo: string, ...args: any[]): Observable<T> {
    return defer(() =>
      from(this.ensureConnected().then(() => this.hubConnection.invoke<T>(metodo, ...args)))
    );
  }

  // ── Chat Privado: sin cambios ──
  obtenerHistorial(otroUsuarioId: string): Promise<any[]> {
    return this.hubConnection.invoke<any[]>('ObtenerHistorial', otroUsuarioId);
  }

  enviarMensaje(data: { mensaje: string; usuarioDestinoId: string }): void {
    if (!this.hubConnection) return;
    this.hubConnection.invoke('EnviarMensajePrivado', data.usuarioDestinoId, data.mensaje)
      .catch(err => console.error(err));
  }

  // ── Grupal (Observables) ──
  obtenerMisGrupos(): Observable<Grupo[]> {
    return this.invoke$<Grupo[]>('ObtenerMisGrupos');
  }

  crearGrupo(nombre: string, descripcion?: string): Observable<string> {
    return this.invoke$<string>('CrearGrupo', nombre, descripcion ?? null);
  }

  unirseGrupo(grupoId: string): Observable<void> {
    this.grupoActualId = grupoId;
    return this.invoke$<void>('UnirseGrupo', { grupoId });
  }

  salirGrupo(grupoId: string): Observable<void> {
    if (this.grupoActualId === grupoId) this.grupoActualId = null;
    return this.invoke$<void>('SalirGrupo', grupoId);
  }

  obtenerHistorialGrupo(grupoId: string): Observable<ChatGrupal[]> {
    return this.invoke$<ChatGrupal[]>('ObtenerHistorialGrupo', grupoId);
  }

  enviarMensajeGrupo(grupoId: string, mensaje: string): Observable<void> {
    return this.invoke$<void>('EnviarMensajeGrupo', grupoId, mensaje);
  }

  stopConnection(): void {
    this.hubConnection?.stop()
      .then(() => console.log('🔌 SignalR desconectado'))
      .catch(err => console.error(err));
  }
}