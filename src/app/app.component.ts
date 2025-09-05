import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapComponent } from "./map/map.component";
import { MapTestComponent } from "./map-test/map-test.component";
import { TrackingComponent } from "./tracking/tracking.component";


@Component({
  selector: 'app-root',
  //imports: [RouterOutlet, MapComponent, MapTestComponent],
  imports: [MapComponent, TrackingComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TransportProjectFront';
}
