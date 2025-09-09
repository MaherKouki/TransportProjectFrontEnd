import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearestStopComponent } from './nearest-stop.component';

describe('NearestStopComponent', () => {
  let component: NearestStopComponent;
  let fixture: ComponentFixture<NearestStopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearestStopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NearestStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
