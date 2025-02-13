import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourClientListComponent } from './your-client-list.component';

describe('YourClientListComponent', () => {
  let component: YourClientListComponent;
  let fixture: ComponentFixture<YourClientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourClientListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
