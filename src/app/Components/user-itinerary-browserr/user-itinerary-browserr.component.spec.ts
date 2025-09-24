import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserItineraryBrowserrComponent } from './user-itinerary-browserr.component';

describe('UserItineraryBrowserrComponent', () => {
  let component: UserItineraryBrowserrComponent;
  let fixture: ComponentFixture<UserItineraryBrowserrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserItineraryBrowserrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserItineraryBrowserrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
