import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAlumnoComponent } from './create-alumno.component';

describe('CreateAlumnoComponent', () => {
  let component: CreateAlumnoComponent;
  let fixture: ComponentFixture<CreateAlumnoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAlumnoComponent]
    });
    fixture = TestBed.createComponent(CreateAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
