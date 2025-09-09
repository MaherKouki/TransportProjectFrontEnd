// // import { Component } from '@angular/core';
// // import { RouterOutlet } from '@angular/router';
// // import { MapComponent } from "./map/map.component";
// // import { MapTestComponent } from "./map-test/map-test.component";
// // import { TrackingComponent } from "./tracking/tracking.component";


// // @Component({
// //   selector: 'app-root',
// //   //imports: [RouterOutlet, MapComponent, MapTestComponent],
// //   imports: [MapComponent, TrackingComponent],

// //   templateUrl: './app.component.html',
// //   styleUrl: './app.component.css'
// // })
// // export class AppComponent {
// //   title = 'TransportProjectFront';
// // }






// import { Component } from "@angular/core"

// @Component({
//   selector: "app-root",
//   templateUrl: "./app.component.html",
//   styleUrls: ["./app.component.css"],
// })
// export class AppComponent {
//   title = "Bus Transport Management System"

//   menuItems = [
//     { name: "Dashboard", route: "/dashboard", icon: "dashboard" },
//     { name: "Buses", route: "/buses", icon: "directions_bus" },
//     { name: "Stops", route: "/stops", icon: "place" },
//     { name: "Itineraries", route: "/itineraries", icon: "route" },
//     { name: "Create Itinerary", route: "/itinerary-form", icon: "add_location" },
//     { name: "Bus Tracking", route: "/bus-tracking", icon: "gps_fixed" },
//     { name: "Nearest Stop", route: "/nearest-stop", icon: "near_me" },
//     { name: "Driver Tracking", route: "/driver-tracking", icon: "drive_eta" },
//   ]
// }









import { Component } from "@angular/core";
import { RouterOutlet, RouterModule } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-root",
  standalone: true,   // ✅ makes this a standalone component
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  imports: [          // ✅ bring in Angular Material + Router
    RouterOutlet,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class AppComponent {
  title = "Bus Transport Management System";

  menuItems = [
    { name: "Dashboard", route: "/dashboard", icon: "dashboard" },
    { name: "Buses", route: "/buses", icon: "directions_bus" },
    { name: "Stops", route: "/stops", icon: "place" },
    { name: "Itineraries", route: "/itineraries", icon: "route" },
    { name: "Create Itinerary", route: "/itinerary-form", icon: "add_location" },
    { name: "Bus Tracking", route: "/bus-tracking", icon: "gps_fixed" },
    { name: "Nearest Stop", route: "/nearest-stop", icon: "near_me" },
    { name: "Driver Tracking", route: "/driver-tracking", icon: "drive_eta" },
  ];
}
