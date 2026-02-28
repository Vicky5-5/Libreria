import { Injectable, inject} from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from './acceso.service';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

private timeout: any;
private readonly inactivityTime = 15 * 60 * 1000; // 15 minutos

private router= inject(Router);
private accesoService= inject(AccesoService);
private signalRService= inject(SignalrService);
iniciarSeguimiento(): void {
    this.resetTimer();

    window.addEventListener('click', () => this.resetTimer());
    window.addEventListener('mousemove', () => this.resetTimer());
    window.addEventListener('keypress', () => this.resetTimer());
    window.addEventListener('scroll', () => this.resetTimer());
  }

  private resetTimer(): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.logoutPorInactividad(), this.inactivityTime);
  }

  private logoutPorInactividad(): void {
    alert('Sesión cerrada por inactividad.');
    this.signalRService.stopConnection();
    this.accesoService.logout();
    this.router.navigate(['/login']);
  }
}
