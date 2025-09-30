


//           WORKS WELLLLLLLLLLLLLLLLLLLL

// import { Component } from '@angular/core';
// import { BusPositionService } from '../service/BusPositionService/bus-position.service';
// //import { BusPositionService } from '../service/bus-position.service';

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

//   constructor(private service: BusPositionService) {}

//   start() {
//     if (this.intervalId) return; // prevent multiple intervals

//     this.intervalId = setInterval(() => {
//       navigator.geolocation.getCurrentPosition(
//         pos => {
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
//         err => this.currentStatus = 'Error: ' + err.message,
//         { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
//       );
//     }, 4000); // every 2 seconds
//   }

//   stop() {
//     if (this.intervalId) {
//       clearInterval(this.intervalId);
//       this.intervalId = null;
//       this.currentStatus = 'Stopped';
//     }
//   }
// }






















import { Component, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { BusPositionService } from '../service/BusPositionService/bus-position.service'
import { BusService } from '../service/BusService/bus.service'
import { Bus } from '../entity/bus'

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class TrackingComponent implements OnInit, OnDestroy {
  intervalId: any = null
  selectedBusId: number | null = null
  buses: Bus[] = []
  isTracking = false
  loadingBuses = false
  
  currentPosition: { lat: number; lon: number } | null = null
  lastUpdateTime: Date | null = null
  positionsSent = 0
  errorMessage: string | null = null

  constructor(
    private positionService: BusPositionService,
    private busService: BusService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBuses()
  }

  ngOnDestroy(): void {
    this.stopTracking()
  }

  loadBuses(): void {
    this.loadingBuses = true
    this.busService.getAllBuses().subscribe({
      next: (buses) => {
        this.buses = buses
        this.loadingBuses = false
      },
      error: (error) => {
        console.error('Error loading buses:', error)
        this.snackBar.open('Failed to load buses', 'Close', { duration: 3000 })
        this.loadingBuses = false
      }
    })
  }

  startTracking(): void {
    if (!this.selectedBusId) {
      this.snackBar.open('Please select a bus first', 'Close', { duration: 3000 })
      return
    }

    if (this.intervalId) {
      this.snackBar.open('Tracking is already active', 'Close', { duration: 2000 })
      return
    }

    if (!navigator.geolocation) {
      this.errorMessage = 'Geolocation is not supported by your browser'
      this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 })
      return
    }

    this.isTracking = true
    this.positionsSent = 0
    this.errorMessage = null
    
    this.snackBar.open('Tracking started successfully', 'Close', { duration: 2000 })

    // Send position immediately on start
    this.sendCurrentPosition()

    // Then send every 4 seconds
    this.intervalId = setInterval(() => {
      this.sendCurrentPosition()
    }, 4000)
  }

  sendCurrentPosition(): void {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude

        this.currentPosition = { lat, lon }
        this.lastUpdateTime = new Date()
        this.errorMessage = null

        console.log('Sending position:', { busId: this.selectedBusId, lat, lon })

        this.positionService.sendPosition(this.selectedBusId!, lat, lon).subscribe({
          next: () => {
            this.positionsSent++
            console.log('Position sent successfully. Total:', this.positionsSent)
          },
          error: (error) => {
            console.error('Error sending position:', error)
            this.errorMessage = 'Failed to send position to server'
          }
        })
      },
      (error) => {
        console.error('Geolocation error:', error)
        this.errorMessage = this.getGeolocationErrorMessage(error)
        this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 })
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    )
  }

  stopTracking(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      this.isTracking = false
      this.snackBar.open('Tracking stopped', 'Close', { duration: 2000 })
    }
  }

  getGeolocationErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location permission denied. Please enable location access.'
      case error.POSITION_UNAVAILABLE:
        return 'Location information unavailable.'
      case error.TIMEOUT:
        return 'Location request timed out.'
      default:
        return 'An unknown error occurred.'
    }
  }

  getBusDisplayName(bus: Bus): string {
    return `${bus.matricule} - ${bus.marque || 'Unknown Brand'}`
  }

  canStartTracking(): boolean {
    return this.selectedBusId !== null && !this.isTracking && !this.loadingBuses
  }
}