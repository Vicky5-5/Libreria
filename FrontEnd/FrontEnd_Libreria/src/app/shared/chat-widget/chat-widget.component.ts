import {Component,OnInit, OnDestroy,ChangeDetectionStrategy,Inject, PLATFORM_ID} from '@angular/core';import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignalrService, MensajeChat } from '../../Servicios/signalr.service';
import { Subject, takeUntil } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AccesoService } from '../../Servicios/acceso.service';
import { MatIconModule } from "@angular/material/icon";
import { ChatComponent } from "../../Componentes/chat/chat.component";

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
  messages: MensajeChat[] = [];
  newMessage = '';
  unreadCount = 0;
  currentUserId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private chatService: SignalrService,
    private accesoService: AccesoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.accesoService.isLoggedIn()) return;

    this.currentUserId = localStorage.getItem('userId');

    this.chatService.mensajes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {

        if (!this.isOpen) {
          this.unreadCount++;
        }

        this.messages = [...this.messages, msg];

        setTimeout(() => this.scrollToBottom(), 50);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.unreadCount = 0;
      setTimeout(() => this.scrollToBottom(), 50);
    }
  }



  private scrollToBottom(): void {
    const container = document.querySelector('.chat-body');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}