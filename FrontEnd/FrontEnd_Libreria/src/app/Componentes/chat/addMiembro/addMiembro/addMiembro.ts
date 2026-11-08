import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input,
  OnChanges, OnDestroy, Output, SimpleChanges, inject
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subject, forkJoin, takeUntil } from 'rxjs';

import { SignalrService } from '../../../../Servicios/signalr.service';
import { UsuariosService } from '../../../../Servicios/usuarios.service';
import { MiembroGrupo } from '../../../../interface/MiembroGrupo';
import { Usuario } from '../../../../interface/Usuario';

type Pestana = 'miembros' | 'anadir';

@Component({
  selector: 'app-add-miembro',
  standalone: true,
  imports: [AsyncPipe, FormsModule, MatIconModule],
  templateUrl: './addMiembro.html',
  styleUrl: './addMiembro.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddMiembro implements OnChanges, OnDestroy {

  @Input({ required: true }) grupoId!: string;
  @Output() cerrar = new EventEmitter<void>();

  private chat = inject(SignalrService);
  private usuarioService = inject(UsuariosService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  conectados$ = this.chat.conectados$;

  pestana: Pestana = 'miembros';
  miembros: MiembroGrupo[] = [];
  usuarios: Usuario[] = [];
  filtro = '';
  seleccionados = new Set<string>();

  cargando = true;
  procesando = false;               // bloquea los botones mientras hay una llamada en curso
  confirmandoId: string | null = null;
  errorMsg = '';
  okMsg = '';

  get esAdmin(): boolean {
    return this.miembros.some(m => m.yo && m.admin);
  }

  get soyCreador(): boolean {
    return this.miembros.some(m => m.yo && m.esCreador);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['grupoId'] && this.grupoId) {
      this.cargar();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargar(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.okMsg = '';
    this.cdr.markForCheck();

    forkJoin({
      miembros: this.chat.obtenerMiembrosGrupo(this.grupoId),
      usuarios: this.usuarioService.listar()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ miembros, usuarios }) => {
          this.miembros = miembros;
          this.usuarios = usuarios.isSuccess ? usuarios.data : [];
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: err => {
          this.errorMsg = err?.message ?? 'No se pudo cargar la información del grupo.';
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
  }

  cambiarPestana(p: Pestana): void {
    this.pestana = p;
    this.filtro = '';
    this.seleccionados = new Set();
    this.confirmandoId = null;
    this.errorMsg = '';
    this.okMsg = '';
  }

  // ── Listas filtradas ──

  miembrosFiltrados(): MiembroGrupo[] {
    const f = this.filtro.toLowerCase();
    return this.miembros.filter(m => m.nombre.toLowerCase().includes(f));
  }

  disponibles(): Usuario[] {
    const enGrupo = new Set(this.miembros.map(m => m.id));
    const f = this.filtro.toLowerCase();
    return this.usuarios.filter(u => !enGrupo.has(u.id) && u.nombre.toLowerCase().includes(f));
  }

  // ── Selección múltiple ──

  toggle(id: string): void {
    const nuevo = new Set(this.seleccionados);
    nuevo.has(id) ? nuevo.delete(id) : nuevo.add(id);
    this.seleccionados = nuevo;
  }

  todosSeleccionados(): boolean {
    const lista = this.disponibles();
    return lista.length > 0 && lista.every(u => this.seleccionados.has(u.id));
  }

  seleccionarTodos(): void {
    const nuevo = new Set(this.seleccionados);
    if (this.todosSeleccionados()) {
      this.disponibles().forEach(u => nuevo.delete(u.id));
    } else {
      this.disponibles().forEach(u => nuevo.add(u.id));
    }
    this.seleccionados = nuevo;
  }

  // ── Permisos de la interfaz (el servidor vuelve a validarlos) ──

  puedeQuitar(m: MiembroGrupo): boolean {
    if (m.yo || m.esCreador) return false;
    return m.admin ? this.soyCreador : this.esAdmin;
  }

  puedeCambiarRol(m: MiembroGrupo): boolean {
    if (m.yo || m.esCreador) return false;
    return m.admin ? this.soyCreador : this.esAdmin;
  }

  // ── Acciones ──

  agregarSeleccionados(): void {
    const ids = [...this.seleccionados];
    if (ids.length === 0 || this.procesando) return;

    this.lanzar(this.chat.agregarMiembrosGrupo(this.grupoId, ids), agregados => {
      const nuevos = this.usuarios
        .filter(u => agregados.includes(u.id))
        .map((u): MiembroGrupo => ({
          id: u.id, nombre: u.nombre, admin: false, yo: false, esCreador: false
        }));

      this.miembros = [...this.miembros, ...nuevos];
      this.seleccionados = new Set();
      this.okMsg = nuevos.length === 1
        ? '1 usuario añadido al grupo.'
        : `${nuevos.length} usuarios añadidos al grupo.`;

      if (nuevos.length < ids.length) {
        this.errorMsg = 'Algunos usuarios no se pudieron añadir (ya eran miembros o no existen).';
      }
    });
  }

  confirmarQuitar(m: MiembroGrupo): void {
    this.lanzar(this.chat.quitarMiembroGrupo(this.grupoId, m.id), () => {
      this.miembros = this.miembros.filter(x => x.id !== m.id);
      this.confirmandoId = null;
      this.okMsg = `${m.nombre} fue quitado del grupo.`;
    });
  }

  cambiarRol(m: MiembroGrupo): void {
    const nuevoRol = !m.admin;

    this.lanzar(this.chat.cambiarAdminGrupo(this.grupoId, m.id, nuevoRol), () => {
      this.miembros = this.miembros.map(x => x.id === m.id ? { ...x, admin: nuevoRol } : x);
      this.okMsg = nuevoRol
        ? `${m.nombre} ahora es administrador.`
        : `${m.nombre} ya no es administrador.`;
    });
  }

  // Envuelve cualquier llamada al hub: bloquea botones, limpia mensajes y muestra el error
  private lanzar<T>(llamada: Observable<T>, alTerminar: (resultado: T) => void): void {
    this.procesando = true;
    this.errorMsg = '';
    this.okMsg = '';
    this.cdr.markForCheck();

    llamada.pipe(takeUntil(this.destroy$)).subscribe({
      next: resultado => {
        alTerminar(resultado);
        this.procesando = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.errorMsg = err?.message ?? 'No se pudo completar la acción.';
        this.procesando = false;
        this.confirmandoId = null;
        this.cdr.markForCheck();
      }
    });
  }
}