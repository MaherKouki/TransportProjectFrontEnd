import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStopsMapComponent } from './add-stops-map.component';

describe('AddStopsMapComponent', () => {
  let component: AddStopsMapComponent;
  let fixture: ComponentFixture<AddStopsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStopsMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStopsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
