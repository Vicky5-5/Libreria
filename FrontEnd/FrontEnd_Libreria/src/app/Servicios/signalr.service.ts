import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';

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

  private mensajeSubject = new Subject<MensajeChat>();
  mensajes$ = this.mensajeSubject.asObservable();

  // Guarda los IDs de usuarios conectados en tiempo real
  private conectadosSubject = new BehaviorSubject<Set<string>>(new Set());
  conectados$ = this.conectadosSubject.asObservable();

  startConnection(): void {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7105/chat', {
        accessTokenFactory: () => localStorage.getItem('token') ?? ''
      })
      .withAutomaticReconnect()
      .build();

    // Recibe mensajes privados del servidor
    this.hubConnection.on('RecibirMensaje', (data: MensajeChat) => {
      this.mensajeSubject.next(data);
    });

    // Alguien se conectó → añadir al Set
    this.hubConnection.on('UsuarioConectado', (userId: string) => {
      const actual = new Set(this.conectadosSubject.value);
      actual.add(userId);
      this.conectadosSubject.next(actual);
    });

    // Alguien se desconectó → quitar del Set
    this.hubConnection.on('UsuarioDesconectado', (userId: string) => {
      const actual = new Set(this.conectadosSubject.value);
      actual.delete(userId);
      this.conectadosSubject.next(actual);
    });
this.hubConnection.on('RecibirMensaje', (data: MensajeChat) => {
  console.log('>>> RecibirMensaje disparado:', data); // ← añade esto
  this.mensajeSubject.next(data);
});
    this.hubConnection.start()
  .then(async () => {
    console.log('✅ SignalR conectado, connectionId:', this.hubConnection.connectionId); // ← añade esto
    const conectados = await this.hubConnection.invoke<string[]>('ObtenerConectados');
    this.conectadosSubject.next(new Set(conectados));
  })
  .catch(err => console.error('❌ Error SignalR:', err));
  }
obtenerHistorial(otroUsuarioId: string): Promise<any[]> {
  return this.hubConnection.invoke<any[]>('ObtenerHistorial', otroUsuarioId);
}
  // Dos argumentos separados porque el hub los recibe así
  enviarMensaje(data: { mensaje: string; usuarioDestinoId: string }): void {
    if (!this.hubConnection) return;
    this.hubConnection.invoke('EnviarMensajePrivado', data.usuarioDestinoId, data.mensaje)
      .catch(err => console.error(err));
  }

  stopConnection(): void {
    this.hubConnection?.stop()
      .then(() => console.log('🔌 SignalR desconectado'))
      .catch(err => console.error(err));
  }
}