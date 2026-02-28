import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalrService, MensajeChat } from '../../Servicios/signalr.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWidgetComponent implements OnInit {

  isOpen = false;
  messages: MensajeChat[] = [];
  newMessage = '';
  unreadCount = 0;
  currentUserId: string | null = null;
  constructor(private chatService: SignalrService) {}

ngOnInit(): void {
  this.currentUserId = localStorage.getItem('userId');

  this.chatService.mensajes$.subscribe(msg => {
    if (!this.isOpen) {
      this.unreadCount++;
    }

    this.messages = [...this.messages, msg];
    setTimeout(() => this.scrollToBottom(), 50);
  });
}

  toggleChat(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.unreadCount = 0;
      setTimeout(() => this.scrollToBottom(), 50);
    }
  }

  send(): void {
    if (this.newMessage.trim() !== '') {
      this.chatService.enviarMensaje(this.newMessage);
      this.newMessage = '';
    }
  }

  private scrollToBottom(): void {
    const container = document.querySelector('.chat-body');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}