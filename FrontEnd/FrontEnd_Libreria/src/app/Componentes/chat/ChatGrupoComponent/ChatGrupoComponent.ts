import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  OnDestroy,
  OnChanges,
  PLATFORM_ID,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { SignalrService } from '../../../Servicios/signalr.service';
import { Grupo } from '../../../interface/Grupo';
import { ChatGrupal } from '../../../interface/ChatGrupal';

import {
  Subject,
  takeUntil,
  switchMap,
  tap,
  of,
  from
} from 'rxjs';

@Component({
  selector: 'app-chat-grupo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './chatGrupoComponent.html',
  styleUrl: './chatGrupoComponent.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatGrupoComponent implements OnInit, OnDestroy, OnChanges {

  messages: ChatGrupal[] = [];
  newMessage = '';
  filtroGrupo = '';

  grupoSeleccionadoInterno: Grupo | null = null;
  listaGrupos: Grupo[] = [];

  @Output() grupoSeleccionado = new EventEmitter<Grupo>();

  @ViewChild('chatBody')
  chatBody!: ElementRef;

  @Input() mostrarSoloChat = false;
  @Input() resetear = false;

  currentUserId: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private chat: SignalrService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['resetear']?.currentValue === true) {

      if (this.grupoSeleccionadoInterno) {

        from(
          this.chat.salirGrupo(
            this.grupoSeleccionadoInterno.id
          )
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: err =>
            console.error('Error al salir del grupo:', err)
        });
      }

      this.grupoSeleccionadoInterno = null;
      this.messages = [];

      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.currentUserId =
      localStorage.getItem('userId');

    this.chat.mensajesGrupo$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(msg => {

        if (
          this.grupoSeleccionadoInterno &&
          msg.grupoId === this.grupoSeleccionadoInterno.id
        ) {

          this.messages = [
            ...this.messages,
            msg
          ];

          this.cdr.markForCheck();

          this.scrollToBottom();
        }
      });

    this.obtenerGrupos();
  }

  ngOnDestroy(): void {

    if (this.grupoSeleccionadoInterno) {

      this.chat
        .salirGrupo(
          this.grupoSeleccionadoInterno.id
        )
        .catch(err =>
          console.error(
            'Error al salir del grupo:',
            err
          )
        );
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  scrollToBottom(): void {

    setTimeout(() => {

      if (this.chatBody?.nativeElement) {

        this.chatBody.nativeElement.scrollTop =
          this.chatBody.nativeElement.scrollHeight;
      }

    }, 50);
  }

  obtenerGrupos(): void {

    from(
      this.chat.obtenerMisGrupos()
    )
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({

      next: grupos => {

        this.listaGrupos = grupos;

        this.cdr.markForCheck();
      },

      error: err => {

        console.error(
          'Error al cargar grupos:',
          err
        );
      }
    });
  }

  gruposFiltrados(): Grupo[] {

    return this.listaGrupos.filter(g =>
      g.nombre
        .toLowerCase()
        .includes(
          this.filtroGrupo.toLowerCase()
        )
    );
  }

  seleccionarGrupo(grupo: Grupo): void {

    const debeSalirPrimero =
      this.grupoSeleccionadoInterno &&
      this.grupoSeleccionadoInterno.id !== grupo.id;

    const salir$ = debeSalirPrimero
      ? from(
          this.chat.salirGrupo(
            this.grupoSeleccionadoInterno!.id
          )
        )
      : of(undefined);

    salir$
      .pipe(

        tap(() => {

          this.grupoSeleccionadoInterno = grupo;

          this.grupoSeleccionado.emit(grupo);

          this.messages = [];

          this.cdr.markForCheck();
        }),

        switchMap(() =>
          from(
            this.chat.unirseGrupo(grupo.id)
          )
        ),

        switchMap(() =>
          from(
            this.chat.obtenerHistorialGrupo(
              grupo.id
            )
          )
        ),

        takeUntil(this.destroy$)
      )
      .subscribe({

        next: historial => {

          this.messages = historial;

          this.cdr.markForCheck();

          this.scrollToBottom();
        },

        error: err => {

          console.error(
            'Error cargando grupo:',
            err
          );
        }
      });
  }

  enviarMensaje(): void {

    if (
      !this.newMessage.trim() ||
      !this.grupoSeleccionadoInterno
    ) {
      return;
    }

    const texto = this.newMessage;

    this.newMessage = '';

    this.chat.enviarMensajeGrupo(
      this.grupoSeleccionadoInterno.id,
      texto
    );
  }
}