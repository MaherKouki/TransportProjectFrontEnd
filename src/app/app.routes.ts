// // import { Routes } from '@angular/router';

// // export const routes: Routes = [];






// import { Routes } from '@angular/router';
// import { DashboardComponent } from './Components/dashboard/dashboard.component';
// import { BusListComponent } from './Components/bus-list/bus-list.component';
// import { StopListComponent } from './Components/stop-list/stop-list.component';
// import { ItineraryListComponent } from './Components/itinerary-list/itinerary-list.component';
// import { ItineraryFormComponent } from './Components/itinerary-form/itinerary-form.component';
// import { BusTrackingComponent } from './Components/bus-tracking/bus-tracking.component';
// import { NearestStopComponent } from './Components/nearest-stop/nearest-stop.component';
// import { DriverTrackingComponent } from './Components/driver-tracking/driver-tracking.component';
// import { ItineraryMapComponent } from './Components/itinerary-map/itinerary-map.component';
// import { AddStopsMapComponent } from './Components/add-stops-map/add-stops-map.component';
// import { RouteDetailsComponent } from './Components/route-details/route-details.component';
// //import { UserItineraryBrowserComponent, UserItineraryBrowserrrComponent } from './Components/user-itinerary-browser/user-itinerary-browser.component';
// import { TrackingComponent } from './tracking/tracking.component';
// import { UserItineraryBrowserComponent } from './Components/user-itinerary-browser/user-itinerary-browser.component';
// import { UserItineraryBrowserrComponent } from './Components/user-itinerary-browserr/user-itinerary-browserr.component';
// import { LiveBusTrackingComponent } from './Components/live-bus-tracking/live-bus-tracking.component';
// import { UpdateItineraryComponent } from './Components/update-itinerary/update-itinerary.component';

// // export const routes: Routes = [

// //   { path: "", redirectTo: "/dashboard", pathMatch: "full" },
// //   { path: "dashboard", component: DashboardComponent },
// //   { path: "buses", component: BusListComponent },
// //   { path: "stops", component: StopListComponent },
// //   { path: "itineraries", component: ItineraryListComponent },
// //   { path: "itinerary-form", component: ItineraryFormComponent },


// //   { path: "itinerary-map", component: ItineraryMapComponent },

// //   //{ path: "addStopsMap", component: AddStopsMapComponent },

// //   { path: 'addStopsMap/:id', component: AddStopsMapComponent },

// //   { path: 'routeDetails', component: RouteDetailsComponent },

// //   { path: 'userItinerary', component: UserItineraryBrowserComponent },

// //   { path: 'mainItinerary', component: UserItineraryBrowserrComponent },




// //   { path: "bus-tracking", component: BusTrackingComponent },
// //   { path: "nearest-stop", component: NearestStopComponent },
// //   //{ path: "driver-tracking", component: DriverTrackingComponent },

// //   { path: "trackBus", component: TrackingComponent },

  
// //   { path: 'liveTracking/:busId', component: LiveBusTrackingComponent },

// //   { path: 'update-itinerary/:id', component: UpdateItineraryComponent }



// // ];
// export const routes: Routes = [
//   // Default redirect to user main page
//   { path: '', redirectTo: '/mainItinerary', pathMatch: 'full' },
  
//   // ========== ADMIN ROUTES ==========
//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'buses', component: BusListComponent },
//   { path: 'stops', component: StopListComponent },
//   { path: 'itineraries', component: ItineraryListComponent },
//   { path: 'itinerary-form', component: ItineraryFormComponent },
//   { path: 'update-itinerary/:id', component: UpdateItineraryComponent },
//   { path: 'itinerary-map', component: ItineraryMapComponent },
//   { path: 'addStopsMap/:id', component: AddStopsMapComponent },
//   { path: 'bus-tracking', component: BusTrackingComponent },
//   { path: 'trackBus', component: TrackingComponent },
  
//   // ========== USER ROUTES ==========
//   { path: 'mainItinerary', component: UserItineraryBrowserrComponent },
//   { path: 'userItinerary', component: UserItineraryBrowserComponent },
//   { path: 'nearest-stop', component: NearestStopComponent },
//   { path: 'liveTracking/:busId', component: LiveBusTrackingComponent },
  
//   // ========== SHARED ROUTES ==========
//   { path: 'routeDetails', component: RouteDetailsComponent },
  
//   // Wildcard route - redirect to main user page
//   { path: '**', redirectTo: '/mainItinerary' }
// ];














import { Routes } from '@angular/router';
//import { AppLayoutComponent } from './Components/app-layout/app-layout.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { UnauthorizedComponent } from './Components/unauthorized/unauthorized.component';
//import { authGuard } from './guards/auth.guard';
//import { adminGuard, userGuard, driverGuard } from './guards/role.guard';

import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { BusListComponent } from './Components/bus-list/bus-list.component';
import { StopListComponent } from './Components/stop-list/stop-list.component';
import { ItineraryListComponent } from './Components/itinerary-list/itinerary-list.component';
import { ItineraryFormComponent } from './Components/itinerary-form/itinerary-form.component';
import { BusTrackingComponent } from './Components/bus-tracking/bus-tracking.component';
import { ItineraryMapComponent } from './Components/itinerary-map/itinerary-map.component';
import { AddStopsMapComponent } from './Components/add-stops-map/add-stops-map.component';
import { RouteDetailsComponent } from './Components/route-details/route-details.component';
import { TrackingComponent } from './tracking/tracking.component';
import { UserItineraryBrowserComponent } from './Components/user-itinerary-browser/user-itinerary-browser.component';
import { UserItineraryBrowserrComponent } from './Components/user-itinerary-browserr/user-itinerary-browserr.component';
import { LiveBusTrackingComponent } from './Components/live-bus-tracking/live-bus-tracking.component';
import { UpdateItineraryComponent } from './Components/update-itinerary/update-itinerary.component';
import { NearestStopComponent } from './Components/nearest-stop/nearest-stop.component';
import { authGuard } from './Guards/auth.guard';
import { adminGuard, driverGuard, userGuard } from './Guards/role.guard';
import { TrackingAdminComponent } from './Components/tracking-admin/tracking-admin.component';
import { DriverManagementComponent } from './Components/driver-management/driver-management.component';

// export const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   { path: 'unauthorized', component: UnauthorizedComponent },
//   {
//     path: '',
//     component: AppLayoutComponent,
//     canActivate: [authGuard],
//     children: [
//       { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      
//       // Admin Routes
//       { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
//       { path: 'buses', component: BusListComponent, canActivate: [adminGuard] },
//       { path: 'stops', component: StopListComponent, canActivate: [adminGuard] },
//       { path: 'itineraries', component: ItineraryListComponent, canActivate: [adminGuard] },
//       { path: 'itinerary-form', component: ItineraryFormComponent, canActivate: [adminGuard] },
//       { path: 'itinerary-map', component: ItineraryMapComponent, canActivate: [adminGuard] },
//       { path: 'addStopsMap/:id', component: AddStopsMapComponent, canActivate: [adminGuard] },
//       { path: 'bus-tracking', component: BusTrackingComponent, canActivate: [adminGuard] },
//       { path: 'routeDetails', component: RouteDetailsComponent, canActivate: [adminGuard] },
//       { path: 'update-itinerary/:id', component: UpdateItineraryComponent, canActivate: [adminGuard] },
      
//       // User Routes
//       { path: 'userItinerary', component: UserItineraryBrowserComponent, canActivate: [userGuard] },
//       { path: 'mainItinerary', component: UserItineraryBrowserrComponent, canActivate: [userGuard] },
//       { path: 'nearest-stop', component: NearestStopComponent, canActivate: [userGuard] },
//       { path: 'liveTracking/:busId', component: LiveBusTrackingComponent, canActivate: [userGuard] },
      
//       // Driver Routes
//       { path: 'trackBus', component: TrackingComponent, canActivate: [driverGuard] }
//     ]
//   }
// ];










export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Admin Routes
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'buses', component: BusListComponent, canActivate: [authGuard, adminGuard] },
  { path: 'stops', component: StopListComponent, canActivate: [authGuard, adminGuard] },
  { path: 'itineraries', component: ItineraryListComponent, canActivate: [authGuard, adminGuard] },

  { path: 'itinerary-form', component: ItineraryFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'itinerary-map', component: ItineraryMapComponent, canActivate: [authGuard, adminGuard] },
  { path: 'addStopsMap/:id', component: AddStopsMapComponent, canActivate: [authGuard, adminGuard] },

  //li 3and luser 5ir
  { path: 'bus-tracking', component: BusTrackingComponent, canActivate: [authGuard, adminGuard] },
  { path: 'routeDetails', component: RouteDetailsComponent, canActivate: [authGuard, adminGuard] },
  { path: 'update-itinerary/:id', component: UpdateItineraryComponent, canActivate: [authGuard, adminGuard] },
        { path: 'driver-management', component: DriverManagementComponent, canActivate: [adminGuard] },


        
  // User Routes
  { path: 'userItinerary', component: UserItineraryBrowserComponent, canActivate: [authGuard, userGuard] },//mafama menou 7ata lezna ema design tahfoun
  //for the user mrigla
  { path: 'mainItinerary', component: UserItineraryBrowserrComponent, canActivate: [authGuard, userGuard] },
  { path: 'nearest-stop', component: NearestStopComponent, canActivate: [authGuard, userGuard] },
  { path: 'liveTracking/:busId', component: LiveBusTrackingComponent, canActivate: [authGuard, userGuard] },
  //{ path: 'trackBusAdmin', component: TrackingComponent, canActivate: [authGuard, adminGuard] },


  // Driver Routes
  { path: 'trackBus', component: TrackingComponent, canActivate: [authGuard, driverGuard] },

  { path: '**', redirectTo: '/unauthorized' }
];
