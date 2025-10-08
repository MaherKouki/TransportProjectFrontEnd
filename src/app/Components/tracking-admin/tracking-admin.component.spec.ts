import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingAdminComponent } from './tracking-admin.component';

describe('TrackingAdminComponent', () => {
  let component: TrackingAdminComponent;
  let fixture: ComponentFixture<TrackingAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackingAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
