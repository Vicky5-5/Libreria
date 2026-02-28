import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface MensajeChat {
  userId: string;
  nombre: string;
  mensaje: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection!: signalR.HubConnection;

  // Stream reactivo de mensajes
  private mensajeSubject = new Subject<MensajeChat>();
  mensajes$ = this.mensajeSubject.asObservable();

  startConnection(token?: string): void {

  if (this.hubConnection &&
      this.hubConnection.state === signalR.HubConnectionState.Connected) {
    return;
  }

  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:7105/hub', {
      accessTokenFactory: () => localStorage.getItem('token') ?? ''
    })
    .withAutomaticReconnect()
    .build();

  this.hubConnection.on('RecibirMensaje', (data) => {
    this.mensajeSubject.next(data);
  });

  this.hubConnection.start()
    .then(() => console.log('✅ SignalR conectado'))
    .catch(err => console.error('❌ Error SignalR:', err));
}

  enviarMensaje(mensaje: string): void {
    if (!this.hubConnection) return;

    this.hubConnection.invoke('EnviarMensaje', mensaje)
      .catch(err => console.error(err));
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('🔌 SignalR desconectado'))
        .catch(err => console.error(err));
    }
  }
}