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

export const routes: Routes = [
  { path: "", redirectTo: "/dashboard", pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent },
  { path: "buses", component: BusListComponent },
  { path: "stops", component: StopListComponent },
  { path: "itineraries", component: ItineraryListComponent },
  { path: "itinerary-form", component: ItineraryFormComponent },


  { path: "itinerary-map", component: ItineraryMapComponent },

  { path: "addStopsMap", component: AddStopsMapComponent },


  { path: "bus-tracking", component: BusTrackingComponent },
  { path: "nearest-stop", component: NearestStopComponent },
  { path: "driver-tracking", component: DriverTrackingComponent },
];
