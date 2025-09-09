import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { Bus } from "../../entity/bus"
import { BusPositionService } from "../../service/BusPositionService/bus-position.service"
import { MatSnackBar } from "@angular/material/snack-bar"
import { BusService } from "../../service/BusService/bus.service"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatTableModule } from "@angular/material/table"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatOption } from "@angular/material/autocomplete"


@Component({
  selector: "app-driver-tracking",
  templateUrl: "./driver-tracking.component.html",
  styleUrls: ["./driver-tracking.component.css"],

  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,       // ✅ needed for [formGroup], formControlName
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatOption,
    FormsModule
  ]
})
export class DriverTrackingComponent implements OnInit, OnDestroy {
  driverForm: FormGroup
  buses: Bus[] = []
  selectedBus: Bus | null = null

  isTracking = false
  currentLocation: { lat: number; lng: number } | null = null
  trackingInterval: any
  watchId: number | null = null

  positionHistory: Array<{ lat: number; lng: number; timestamp: Date }> = []

  constructor(
    private fb: FormBuilder,
    private busPositionService: BusPositionService,
    private busService: BusService,
    private snackBar: MatSnackBar,
  ) {
    this.driverForm = this.fb.group({
      busId: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadBuses()
  }

  ngOnDestroy(): void {
    this.stopTracking()
  }

  private loadBuses(): void {
    this.busService.getAllBuses().subscribe({
      next: (buses) => {
        this.buses = buses
      },
      error: (error) => {
        console.error("Error loading buses:", error)
        this.snackBar.open("Error loading buses", "Close", { duration: 3000 })
      },
    })
  }

  onBusSelect(): void {
    const busId = this.driverForm.get("busId")?.value
    this.selectedBus = this.buses.find((bus) => bus.idBus === Number.parseInt(busId)) || null
  }

  startTracking(): void {
    if (!this.selectedBus || !this.selectedBus.idBus) {
      this.snackBar.open("Please select a bus first", "Close", { duration: 3000 })
      return
    }

    if (!navigator.geolocation) {
      this.snackBar.open("Geolocation is not supported by this browser", "Close", { duration: 3000 })
      return
    }

    this.isTracking = true
    this.positionHistory = []

    // Start watching position
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.onLocationUpdate(position)
      },
      (error) => {
        console.error("Geolocation error:", error)
        this.snackBar.open("Error getting location: " + error.message, "Close", { duration: 5000 })
        this.stopTracking()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )

    // Also send position every 5 seconds as backup
    this.trackingInterval = setInterval(() => {
      if (this.currentLocation && this.selectedBus?.idBus) {
        this.sendPositionToServer(this.selectedBus.idBus, this.currentLocation.lat, this.currentLocation.lng)
      }
    }, 5000)

    this.snackBar.open("GPS tracking started", "Close", { duration: 2000 })
  }

  stopTracking(): void {
    this.isTracking = false

    // Stop watching position
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }

    // Clear interval
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval)
      this.trackingInterval = null
    }

    this.snackBar.open("GPS tracking stopped", "Close", { duration: 2000 })
  }

  private onLocationUpdate(position: GeolocationPosition): void {
    const lat = position.coords.latitude
    const lng = position.coords.longitude

    this.currentLocation = { lat, lng }

    // Add to history
    this.positionHistory.unshift({
      lat,
      lng,
      timestamp: new Date(),
    })

    // Keep only last 50 positions
    if (this.positionHistory.length > 50) {
      this.positionHistory = this.positionHistory.slice(0, 50)
    }

    // Send to server
    if (this.selectedBus?.idBus) {
      this.sendPositionToServer(this.selectedBus.idBus, lat, lng)
    }
  }

  private sendPositionToServer(busId: number, lat: number, lng: number): void {
    const timestamp = Date.now()

    this.busPositionService.saveBusPosition(busId, lat, lng, timestamp).subscribe({
      next: (response) => {
        console.log("Position sent successfully:", response)
      },
      error: (error) => {
        console.error("Error sending position:", error)
        // Don't show snackbar for every error to avoid spam
      },
    })
  }

  sendManualPosition(): void {
    if (!this.selectedBus?.idBus) {
      this.snackBar.open("Please select a bus first", "Close", { duration: 3000 })
      return
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          this.currentLocation = { lat, lng }
          this.sendPositionToServer(this.selectedBus!.idBus!, lat, lng)
          this.snackBar.open("Position sent successfully", "Close", { duration: 2000 })
        },
        (error) => {
          console.error("Error getting location:", error)
          this.snackBar.open("Error getting current location", "Close", { duration: 3000 })
        },
      )
    }
  }

  clearHistory(): void {
    this.positionHistory = []
    this.snackBar.open("Position history cleared", "Close", { duration: 2000 })
  }

  getAccuracyStatus(): string {
    if (!this.currentLocation) return "No location data"

    // This is a simplified accuracy indicator
    // In a real app, you'd use position.coords.accuracy
    return "GPS Active"
  }

  getTrackingDuration(): string {
    if (!this.isTracking || this.positionHistory.length === 0) {
      return "0 minutes"
    }

    const firstPosition = this.positionHistory[this.positionHistory.length - 1]
    const duration = Date.now() - firstPosition.timestamp.getTime()
    const minutes = Math.floor(duration / 60000)

    return `${minutes} minute${minutes !== 1 ? "s" : ""}`
  }

  formatCoordinate(coord: number): string {
    return coord.toFixed(6)
  }
}
