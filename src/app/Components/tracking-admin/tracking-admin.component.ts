import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BusPositionService } from '../../service/BusPositionService/bus-position.service';
import { BusService } from '../../service/BusService/bus.service';
import { Bus } from '../../entity/bus';

@Component({
  selector: 'app-tracking-admin',

  templateUrl: './tracking-admin.component.html',
  styleUrl: './tracking-admin.component.css',
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
export class TrackingAdminComponent {

  intervalId: any = null
  selectedBusId: number | null = 2   // 👈 Fixed bus ID
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
