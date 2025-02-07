import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWorkoutComponent } from './register-workout.component';

describe('RegisterWorkoutComponent', () => {
  let component: RegisterWorkoutComponent;
  let fixture: ComponentFixture<RegisterWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterWorkoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
