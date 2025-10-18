import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionLibrosComponent } from './administracionLibros.component';

describe('AdministracionComponent', () => {
  let component: AdministracionLibrosComponent;
  let fixture: ComponentFixture<AdministracionLibrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministracionLibrosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministracionLibrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
