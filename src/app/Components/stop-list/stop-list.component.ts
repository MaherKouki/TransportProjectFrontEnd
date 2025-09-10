import { CommonModule } from "@angular/common"
import { Component, OnInit, AfterViewInit } from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatOption } from "@angular/material/autocomplete"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatChipsModule } from "@angular/material/chips"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSelectModule } from "@angular/material/select"
import { MatTableModule } from "@angular/material/table"
import { RouterModule } from "@angular/router"

import * as L from "leaflet"
import { Stop } from "../../entity/stop"
import { StopService } from "../../service/StopService/stop.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-stop-list",
  templateUrl: "./stop-list.component.html",
  styleUrls: ["./stop-list.component.css"],
      standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,       
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatOption,
    FormsModule,
    MatChipsModule,
    MatSelectModule,
    RouterModule,
  ]
})
export class StopListComponent implements OnInit, AfterViewInit {
  stops: Stop[] = []
  stopForm: FormGroup
  loading = false
  private map!: L.Map
  private markers: L.Marker[] = []
  selectedLocation: { lat: number; lng: number } | null = null

  constructor(
    private stopService: StopService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.stopForm = this.fb.group({
      stopName: ["", [Validators.required, Validators.minLength(2)]],
      latitude: ["", [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ["", [Validators.required, Validators.min(-180), Validators.max(180)]],
      estimatedTime: [""],
      arrivalTime: [""],
    })
  }

  ngOnInit(): void {
    this.loadStops()
  }

  ngAfterViewInit(): void {
    this.initMap()
  }

  private initMap(): void {
    // Initialize map centered on Tunisia
    this.map = L.map("map").setView([36.8065, 10.1815], 10)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map)

    // Add click event to map
    this.map.on("click", (e: L.LeafletMouseEvent) => {
      this.onMapClick(e)
    })

    // Fix for default markers
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/marker1.png",
      iconUrl: "/marker1.png",
      shadowUrl: "/marker1.png",
    })
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    this.selectedLocation = { lat: e.latlng.lat, lng: e.latlng.lng }

    // Update form with selected coordinates
    this.stopForm.patchValue({
      latitude: e.latlng.lat.toFixed(6),
      longitude: e.latlng.lng.toFixed(6),
    })

    // Clear existing selection marker
    this.clearSelectionMarker()

    // Add new selection marker
    const marker = L.marker([e.latlng.lat, e.latlng.lng], {
      icon: L.icon({
        iconUrl: "/marker1.png",
        shadowUrl: "/marker1.png",
        iconSize: [8, 10],
        iconAnchor: [8, 10],
      }),
    }).addTo(this.map)

    marker.bindPopup("Selected location").openPopup()
    this.markers.push(marker)
  }

  private clearSelectionMarker(): void {
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker)
    })
    this.markers = []
  }

  loadStops(): void {
    this.loading = true
    // Note: You'll need to implement getAllStops in your backend
    // For now, we'll use an empty array
    this.stops = []
    this.loading = false
    this.displayStopsOnMap()
  }

  private displayStopsOnMap(): void {
    if (!this.map) return

    // Clear existing markers
    this.clearSelectionMarker()

    // Add markers for each stop
    this.stops.forEach((stop) => {
      const marker = L.marker([stop.latitude, stop.longitude])
        .addTo(this.map)
        .bindPopup(`<b>${stop.stopName}</b><br>Lat: ${stop.latitude}<br>Lng: ${stop.longitude}`)
    })
  }

  onSubmit(): void {
    if (this.stopForm.valid) {
      const stopData: Stop = this.stopForm.value

      this.stopService.createStop(stopData).subscribe({
        next: (newStop) => {
          this.stops.push(newStop)
          this.stopForm.reset()
          this.selectedLocation = null
          this.clearSelectionMarker()
          this.displayStopsOnMap()
          this.snackBar.open("Stop added successfully", "Close", { duration: 3000 })
        },
        error: (error) => {
          console.error("Error adding stop:", error)
          this.snackBar.open("Error adding stop", "Close", { duration: 3000 })
        },
      })
    }
  }

  deleteStop(stop: Stop): void {
    if (stop.idStop && confirm("Are you sure you want to delete this stop?")) {
      this.stopService.deleteStop(stop.idStop).subscribe({
        next: () => {
          this.stops = this.stops.filter((s) => s.idStop !== stop.idStop)
          this.displayStopsOnMap()
          this.snackBar.open("Stop deleted successfully", "Close", { duration: 3000 })
        },
        error: (error) => {
          console.error("Error deleting stop:", error)
          this.snackBar.open("Error deleting stop", "Close", { duration: 3000 })
        },
      })
    }
  }

  useCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          this.stopForm.patchValue({
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
          })

          this.map.setView([lat, lng], 15)
          this.onMapClick({ latlng: { lat, lng } } as L.LeafletMouseEvent)
        },
        (error) => {
          console.error("Error getting location:", error)
          this.snackBar.open("Error getting current location", "Close", { duration: 3000 })
        },
      )
    } else {
      this.snackBar.open("Geolocation is not supported by this browser", "Close", { duration: 3000 })
    }
  }
}
