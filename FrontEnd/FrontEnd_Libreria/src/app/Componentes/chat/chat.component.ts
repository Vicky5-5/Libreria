import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SignalrService } from '../../Servicios/signalr.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {

  messages: any[] = [];
  newMessage: string = '';

  constructor(private chat: SignalrService) {}

  ngOnInit(): void {
    this.chat.startConnection();

    this.chat.mensajes$.subscribe(msg => {
     
      this.messages = [...this.messages, msg];
    });
  }

  enviarMensaje(): void {
    if (this.newMessage.trim() !== '') {
      this.chat.enviarMensaje(this.newMessage);
      this.newMessage = '';
    }
  }
}