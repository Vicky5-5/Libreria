import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

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

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7105/hub', {
        accessTokenFactory: () => localStorage.getItem('token') ?? ''
      })
      .withAutomaticReconnect()
      .build();

    // Listener del servidor
    this.hubConnection.on('RecibirMensaje', (data: MensajeChat) => {
      console.log('Mensaje recibido:', data);
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
