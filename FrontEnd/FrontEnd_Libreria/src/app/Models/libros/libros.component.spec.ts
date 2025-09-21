import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibrosComponent } from './libros.component'; // ruta correcta al componente

describe('LibrosComponent', () => {
  let component: LibrosComponent;
  let fixture: ComponentFixture<LibrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibrosComponent] // aquí va en declarations
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
