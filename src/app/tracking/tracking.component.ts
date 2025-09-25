// // tracking.component.ts
// import { Component } from '@angular/core';
// import { BusPositionService } from '../service/bus-position.service';
// //import { BusPositionService } from './bus-position.service';

// @Component({
//   selector: 'app-tracking',
//   template: `
//     <button (click)="start()">Start</button>
//     <button (click)="stop()">Stop</button>
//     <p>{{status}}</p>
//   `
// })
// export class TrackingComponent {
//   watchId: number | null = null;
//   status = '';

//   constructor(private service: BusPositionService) {}

//   start() {
//     this.watchId = navigator.geolocation.watchPosition(
//       pos => {
//         const lat = pos.coords.latitude;
//         const lon = pos.coords.longitude;
//         this.status = `Lat: ${lat}, Lon: ${lon}`;

//         this.service.sendPosition(1, lat, lon).subscribe(); // Example: busId = 1
//       },
//       err => this.status = 'Error: ' + err.message,
//       { enableHighAccuracy: true }
//     );
//   }

//   stop() {
//     if (this.watchId != null) {
//       navigator.geolocation.clearWatch(this.watchId);
//       this.watchId = null;
//       this.status = 'Stopped';
//     }
//   }
// }










// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { BusPositionService } from '../service/BusPositionService/bus-position.service';

// @Component({
//   selector: 'app-tracking',
//   template: `
//     <button (click)="start()">Start Tracking</button>
//     <button (click)="stop()">Stop Tracking</button>

//     <p>Current: {{currentStatus}}</p>

//     <h3>History:</h3>
//     <!-- <ul>
//       <li *ngFor="let pos of history">
//         {{ pos.time | date:'mediumTime' }} → Lat: {{pos.lat}}, Lon: {{pos.lon}}
//       </li>
//     </ul> -->
//   `
// })
// export class TrackingComponent {
//   intervalId: any = null;
//   currentStatus = '';
//   history: {lat: number, lon: number, time: number}[] = [];

//   // Replace with your OpenCage API key
//   private readonly OPENCAGE_KEY = '6e08c552ffd64251958dce44f8649be5';

//   constructor(private service: BusPositionService, private http: HttpClient) {}

//   start() {
//     if (this.intervalId) return; // prevent multiple intervals

//     this.intervalId = setInterval(() => {
//       this.getLocationFromOpenCage().then(
//         ({ lat, lon }) => {
//           const time = Date.now();

//           // Update current status
//           this.currentStatus = `Lat: ${lat}, Lon: ${lon}`;

//           // Save in history
//           this.history.push({ lat, lon, time });

//           // Log in console
//           console.log('New position:', { lat, lon, time });
//           console.log('History:', this.history);

//           // Send to backend
//           this.service.sendPosition(1, lat, lon).subscribe();
//         }
//       ).catch(err => {
//         this.currentStatus = 'Error: ' + err.message;
//         console.error(err);
//       });
//     }, 4000); // every 4 seconds
//   }

//   stop() {
//     if (this.intervalId) {
//       clearInterval(this.intervalId);
//       this.intervalId = null;
//       this.currentStatus = 'Stopped';
//     }
//   }

//   private getLocationFromOpenCage(): Promise<{ lat: number, lon: number }> {
//     // Use "q=auto" to automatically detect location from IP/Wi-Fi
//     const url = `https://api.opencagedata.com/geocode/v1/json?q=Fahs,+Tunisia&key=${this.OPENCAGE_KEY}`;

//     return this.http.get<any>(url).toPromise().then(res => {
//       if (res && res.results && res.results.length > 0) {
//         const geometry = res.results[0].geometry;
//         return { lat: geometry.lat, lon: geometry.lng };
//       } else {
//         throw new Error('No location found from OpenCage');
//       }
//     });
//   }
// }






// import { Component } from '@angular/core';
// import { BusPositionService } from '../service/BusPositionService/bus-position.service';

// @Component({
//   selector: 'app-tracking',
//   template: `
//     <button (click)="start()">Start Tracking</button>
//     <button (click)="stop()">Stop Tracking</button>

//     <p>Current: {{currentStatus}}</p>

//     <h3>History:</h3>
//     <!--
//     <ul>
//       <li *ngFor="let pos of history">
//         {{ pos.time | date:'mediumTime' }} → Lat: {{pos.lat}}, Lon: {{pos.lon}}
//       </li>
//     </ul>
//     -->
//   `
// })
// export class TrackingComponent {
//   intervalId: any = null;
//   currentStatus = '';
//   history: { lat: number, lon: number, time: number }[] = [];

//   constructor(private service: BusPositionService) {}

//   start() {
//     if (this.intervalId) return; // prevent multiple intervals

//     this.intervalId = setInterval(() => {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           const lat = pos.coords.latitude;
//           const lon = pos.coords.longitude;
//           const time = Date.now();

//           // Update current status
//           this.currentStatus = `Lat: ${lat}, Lon: ${lon}`;

//           // Save in history
//           this.history.push({ lat, lon, time });

//           // Log in console
//           console.log('New position:', { lat, lon, time });
//           console.log('History:', this.history);

//           // Send to backend
//           this.service.sendPosition(1, lat, lon).subscribe();
//         },
//         (err) => {
//           this.currentStatus = 'Error: ' + err.message;
//           console.error(err);
//         },
//         { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
//       );
//     }, 4000); // every 4 seconds
//   }

//   stop() {
//     if (this.intervalId) {
//       clearInterval(this.intervalId);
//       this.intervalId = null;
//       this.currentStatus = 'Stopped';
//     }
//   }
// }















//           WORKS WELLLLLLLLLLLLLLLLLLLL

import { Component } from '@angular/core';
import { BusPositionService } from '../service/BusPositionService/bus-position.service';
//import { BusPositionService } from '../service/bus-position.service';

@Component({
  selector: 'app-tracking',
  template: `
    <button (click)="start()">Start Tracking</button>
    <button (click)="stop()">Stop Tracking</button>

    <p>Current: {{currentStatus}}</p>

    <h3>History:</h3>
    <!-- <ul>
      <li *ngFor="let pos of history">
        {{ pos.time | date:'mediumTime' }} → Lat: {{pos.lat}}, Lon: {{pos.lon}}
      </li>
    </ul> -->
  `
})
export class TrackingComponent {
  intervalId: any = null;
  currentStatus = '';
  history: {lat: number, lon: number, time: number}[] = [];

  constructor(private service: BusPositionService) {}

  start() {
    if (this.intervalId) return; // prevent multiple intervals

    this.intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const time = Date.now();

          // Update current status
          this.currentStatus = `Lat: ${lat}, Lon: ${lon}`;

          // Save in history
          this.history.push({ lat, lon, time });

          // Log in console
          console.log('New position:', { lat, lon, time });
          console.log('History:', this.history);

          // Send to backend
          this.service.sendPosition(1, lat, lon).subscribe();
        },
        err => this.currentStatus = 'Error: ' + err.message,
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }, 4000); // every 2 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.currentStatus = 'Stopped';
    }
  }
}