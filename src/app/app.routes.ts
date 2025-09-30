// import { Routes } from '@angular/router';

// export const routes: Routes = [];






import { Routes } from '@angular/router';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { BusListComponent } from './Components/bus-list/bus-list.component';
import { StopListComponent } from './Components/stop-list/stop-list.component';
import { ItineraryListComponent } from './Components/itinerary-list/itinerary-list.component';
import { ItineraryFormComponent } from './Components/itinerary-form/itinerary-form.component';
import { BusTrackingComponent } from './Components/bus-tracking/bus-tracking.component';
import { NearestStopComponent } from './Components/nearest-stop/nearest-stop.component';
import { DriverTrackingComponent } from './Components/driver-tracking/driver-tracking.component';
import { ItineraryMapComponent } from './Components/itinerary-map/itinerary-map.component';
import { AddStopsMapComponent } from './Components/add-stops-map/add-stops-map.component';
import { RouteDetailsComponent } from './Components/route-details/route-details.component';
//import { UserItineraryBrowserComponent, UserItineraryBrowserrrComponent } from './Components/user-itinerary-browser/user-itinerary-browser.component';
import { TrackingComponent } from './tracking/tracking.component';
import { UserItineraryBrowserComponent } from './Components/user-itinerary-browser/user-itinerary-browser.component';
import { UserItineraryBrowserrComponent } from './Components/user-itinerary-browserr/user-itinerary-browserr.component';
import { LiveBusTrackingComponent } from './Components/live-bus-tracking/live-bus-tracking.component';
import { UpdateItineraryComponent } from './Components/update-itinerary/update-itinerary.component';

export const routes: Routes = [

  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent },
  { path: "buses", component: BusListComponent },
  { path: "stops", component: StopListComponent },
  { path: "itineraries", component: ItineraryListComponent },
  { path: "itinerary-form", component: ItineraryFormComponent },


  { path: "itinerary-map", component: ItineraryMapComponent },

  //{ path: "addStopsMap", component: AddStopsMapComponent },

  { path: 'addStopsMap/:id', component: AddStopsMapComponent },

  { path: 'routeDetails', component: RouteDetailsComponent },

  { path: 'userItinerary', component: UserItineraryBrowserComponent },

  { path: 'mainItinerary', component: UserItineraryBrowserrComponent },




  { path: "bus-tracking", component: BusTrackingComponent },
  { path: "nearest-stop", component: NearestStopComponent },
  //{ path: "driver-tracking", component: DriverTrackingComponent },

  { path: "trackBus", component: TrackingComponent },

  
  { path: 'liveTracking/:busId', component: LiveBusTrackingComponent },

  { path: 'update-itinerary/:id', component: UpdateItineraryComponent }



];
