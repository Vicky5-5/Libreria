import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarraNavegacionComponent } from './barra-navegacion.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('BarraNavegacionComponent', () => {
  let component: BarraNavegacionComponent;
  let fixture: ComponentFixture<BarraNavegacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BarraNavegacionComponent, 
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule  // Importante para animaciones de Material
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BarraNavegacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
