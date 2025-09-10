import { Component, OnInit, AfterViewInit } from "@angular/core"

import * as L from "leaflet"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatTableModule } from "@angular/material/table"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatOption } from "@angular/material/autocomplete"
import { MatChipsModule } from "@angular/material/chips"
import { MatSelectModule } from "@angular/material/select"
import { RouterModule } from "@angular/router"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { Itinerary } from "../../entity/itinerary"
import { Stop } from "../../entity/stop"
import { BusPositionService } from "../../service/BusPositionService/bus-position.service"
import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
import { MatSnackBar } from "@angular/material/snack-bar"

@Component({
  selector: "app-nearest-stop",
  templateUrl: "./nearest-stop.component.html",
  styleUrls: ["./nearest-stop.component.css"],
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
    FormsModule,
    MatChipsModule,
    MatSelectModule,
    RouterModule,
  ]

})
export class NearestStopComponent implements OnInit, AfterViewInit {
  searchForm: FormGroup
  private map!: L.Map

  itineraries: Itinerary[] = []
  selectedItinerary: Itinerary | null = null
  nearestStop: Stop | null = null
  travelTime: number | null = null
  userLocation: { lat: number; lng: number } | null = null

  loading = false
  searchPerformed = false

  constructor(
    private fb: FormBuilder,
    private busPositionService: BusPositionService,
    private itineraryService: ItineraryService,
    private snackBar: MatSnackBar,
  ) {
    this.searchForm = this.fb.group({
      latitude: ["", [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: ["", [Validators.required, Validators.min(-180), Validators.max(180)]],
      destinationId: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadItineraries()
  }

  ngAfterViewInit(): void {
    this.initMap()
  }

  private initMap(): void {
    // Initialize map centered on Tunisia
    this.map = L.map("nearest-stop-map").setView([36.8065, 10.1815], 10)

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
      iconRetinaUrl: "assets/marker-icon-2x.png",
      iconUrl: "assets/marker-icon.png",
      shadowUrl: "assets/marker-shadow.png",
    })
  }

  private loadItineraries(): void {
    this.itineraryService.getAllItineraries().subscribe({
      next: (itineraries) => {
        this.itineraries = itineraries
      },
      error: (error) => {
        console.error("Error loading itineraries:", error)
        this.snackBar.open("Error loading itineraries", "Close", { duration: 3000 })
      },
    })
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    this.userLocation = { lat: e.latlng.lat, lng: e.latlng.lng }

    // Update form with selected coordinates
    this.searchForm.patchValue({
      latitude: e.latlng.lat.toFixed(6),
      longitude: e.latlng.lng.toFixed(6),
    })

    // Add marker for user location
    this.addUserLocationMarker(e.latlng.lat, e.latlng.lng)
  }

  private addUserLocationMarker(lat: number, lng: number): void {
    // Clear existing user location markers
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker && (layer as any).isUserLocation) {
        this.map.removeLayer(layer)
      }
    })

    // Add new user location marker
    const marker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: "assets/marker-icon-red.png",
        shadowUrl: "assets/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    }).addTo(this.map)
    ;(marker as any).isUserLocation = true
    marker.bindPopup("Your Location").openPopup()
  }

  useCurrentLocation(): void {
    if (navigator.geolocation) {
      this.loading = true
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          this.userLocation = { lat, lng }
          this.searchForm.patchValue({
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
          })

          this.map.setView([lat, lng], 15)
          this.addUserLocationMarker(lat, lng)
          this.loading = false
        },
        (error) => {
          console.error("Error getting location:", error)
          this.snackBar.open("Error getting current location", "Close", { duration: 3000 })
          this.loading = false
        },
      )
    } else {
      this.snackBar.open("Geolocation is not supported by this browser", "Close", { duration: 3000 })
    }
  }

  onItinerarySelect(): void {
    if (this.selectedItinerary) {
      this.displayItineraryStops()
    }
  }

  private displayItineraryStops(): void {
    if (!this.selectedItinerary || !this.map) return

    // Clear existing stop markers
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker && !(layer as any).isUserLocation) {
        this.map.removeLayer(layer)
      }
    })

    // Display stops
    if (this.selectedItinerary.stops) {
      this.selectedItinerary.stops.forEach((stop, index) => {
        const isFirst = index === 0
        const isLast = index === this.selectedItinerary!.stops!.length - 1

        const iconColor = isFirst ? "green" : isLast ? "red" : "blue"
        const iconUrl = `assets/marker-icon-${iconColor}.png`

        const marker = L.marker([stop.latitude, stop.longitude], {
          icon: L.icon({
            iconUrl,
            shadowUrl: "assets/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          }),
        }).addTo(this.map)

        marker.bindPopup(`
          <b>${stop.stopName}</b><br>
          ${isFirst ? "Departure" : isLast ? "Destination" : "Stop"}<br>
          ID: ${stop.idStop}
        `)
      })

      // Draw route polyline
      const routePoints = this.selectedItinerary.stops.map((stop) => L.latLng(stop.latitude, stop.longitude))

      L.polyline(routePoints, {
        color: "#3f51b5",
        weight: 3,
        opacity: 0.7,
      }).addTo(this.map)
    }
  }

  searchNearestStop(): void {
    if (this.searchForm.valid && this.selectedItinerary) {
      const formData = this.searchForm.value
      const destinationId = Number.parseInt(formData.destinationId)

      this.loading = true
      this.searchPerformed = true

      // Get nearest stop
      this.busPositionService.getNearestStop(formData.latitude, formData.longitude, destinationId).subscribe({
        next: (stop) => {
          this.nearestStop = stop
          this.highlightNearestStop(stop)
          this.getTravelTime(formData.latitude, formData.longitude, destinationId)
        },
        error: (error) => {
          console.error("Error finding nearest stop:", error)
          this.snackBar.open("Error finding nearest stop", "Close", { duration: 3000 })
          this.loading = false
        },
      })
    }
  }

  private getTravelTime(lat: number, lng: number, destinationId: number): void {
    this.busPositionService.getTravelTime(lat, lng, destinationId).subscribe({
      next: (time) => {
        this.travelTime = time
        this.loading = false
      },
      error: (error) => {
        console.error("Error getting travel time:", error)
        this.travelTime = null
        this.loading = false
      },
    })
  }

  private highlightNearestStop(stop: Stop): void {
    if (!this.map) return

    // Add special marker for nearest stop
    const marker = L.marker([stop.latitude, stop.longitude], {
      icon: L.icon({
        iconUrl: "assets/marker-icon-yellow.png",
        shadowUrl: "assets/marker-shadow.png",
        iconSize: [30, 49],
        iconAnchor: [15, 49],
      }),
    }).addTo(this.map)

    marker
      .bindPopup(`
      <b>NEAREST STOP</b><br>
      <b>${stop.stopName}</b><br>
      Lat: ${stop.latitude}<br>
      Lng: ${stop.longitude}
    `)
      .openPopup()

    // Draw line from user location to nearest stop
    if (this.userLocation) {
      L.polyline(
        [
          [this.userLocation.lat, this.userLocation.lng],
          [stop.latitude, stop.longitude],
        ],
        {
          color: "#ff6b35",
          weight: 3,
          opacity: 0.8,
          dashArray: "10, 5",
        },
      ).addTo(this.map)
    }
  }

  getAvailableStops(): Stop[] {
    return this.selectedItinerary?.stops || []
  }

  resetSearch(): void {
    this.searchForm.reset()
    this.nearestStop = null
    this.travelTime = null
    this.userLocation = null
    this.searchPerformed = false

    // Clear map
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        this.map.removeLayer(layer)
      }
    })

    // Redisplay itinerary if selected
    if (this.selectedItinerary) {
      this.displayItineraryStops()
    }
  }
}
