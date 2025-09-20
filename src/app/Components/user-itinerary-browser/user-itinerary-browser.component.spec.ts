import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserItineraryBrowserComponent } from './user-itinerary-browser.component';

describe('UserItineraryBrowserComponent', () => {
  let component: UserItineraryBrowserComponent;
  let fixture: ComponentFixture<UserItineraryBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserItineraryBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserItineraryBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
