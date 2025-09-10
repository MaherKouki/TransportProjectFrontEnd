import { CommonModule } from "@angular/common"
import { Component,  OnInit, AfterViewInit } from "@angular/core"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatOption } from "@angular/material/autocomplete"
import { MatButtonModule } from "@angular/material/button"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatTableModule } from "@angular/material/table"

import * as L from "leaflet"
import { Stop } from "../../entity/stop"
import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Router } from "@angular/router"
import { MatSlideToggleModule } from "@angular/material/slide-toggle"

@Component({
  selector: "app-itinerary-form",
  templateUrl: "./itinerary-form.component.html",
  styleUrls: ["./itinerary-form.component.css"],
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
    MatSlideToggleModule
  ]
})
export class ItineraryFormComponent implements OnInit, AfterViewInit {
  itineraryForm: FormGroup
  private map!: L.Map
  private markers: L.Marker[] = []
  private polyline: L.Polyline | null = null

  selectedDeparture: Stop | null = null
  selectedDestination: Stop | null = null
  intermediateStops: Stop[] = []

  isMapMode = false
  loading = false

  constructor(
    private fb: FormBuilder,
    private itineraryService: ItineraryService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.itineraryForm = this.fb.group({
      // Form-based fields
      departureStopName: ["", Validators.required],
      departureLat: ["", [Validators.required, Validators.min(-90), Validators.max(90)]],
      departureLng: ["", [Validators.required, Validators.min(-180), Validators.max(180)]],
      departureTime: [""],

      destinationStopName: ["", Validators.required],
      destinationLat: ["", [Validators.required, Validators.min(-90), Validators.max(90)]],
      destinationLng: ["", [Validators.required, Validators.min(-180), Validators.max(180)]],
      destinationTime: [""],
    })
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap()
  }

  private initMap(): void {
    // Initialize map centered on Tunisia
    this.map = L.map("itinerary-map").setView([36.8065, 10.1815], 10)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map)

    // Add click event to map for map-based mode
    this.map.on("click", (e: L.LeafletMouseEvent) => {
      if (this.isMapMode) {
        this.onMapClick(e)
      }
    })

    // Fix for default markers
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "assets/marker-icon-2x.png",
      iconUrl: "assets/marker-icon.png",
      shadowUrl: "assets/marker-shadow.png",
    })
  }

  toggleMode(): void {
    this.isMapMode = !this.isMapMode
    this.clearMapData()
    this.itineraryForm.reset()
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    const lat = e.latlng.lat
    const lng = e.latlng.lng

    if (!this.selectedDeparture) {
      // Set departure
      this.selectedDeparture = {
        stopName: `Departure Point`,
        latitude: lat,
        longitude: lng,
        arrivalTime: null,
        estimatedTime: "",
        orderIndex: 0
      }
      this.addMarker(lat, lng, "Departure", "green")
    } else if (!this.selectedDestination) {
      // Set destination
      this.selectedDestination = {
        stopName: `Destination Point`,
        latitude: lat,
        longitude: lng,
        arrivalTime: null,
        estimatedTime: "",
        orderIndex: 0
      }
      this.addMarker(lat, lng, "Destination", "red")
      this.drawRoute()
    } else {
      // Add intermediate stop
      const stopName = `Stop ${this.intermediateStops.length + 1}`
      const intermediateStop: Stop = {
        stopName,
        latitude: lat,
        longitude: lng,
        arrivalTime: null,
        estimatedTime: "",
        orderIndex: 0
      }
      this.intermediateStops.push(intermediateStop)
      this.addMarker(lat, lng, stopName, "blue")
      this.drawRoute()
    }
  }

  private addMarker(lat: number, lng: number, title: string, color: string): void {
    const iconUrl =
      color === "green"
        ? "assets/marker-icon-green.png"
        : color === "red"
          ? "assets/marker-icon-red.png"
          : "assets/marker-icon.png"

    const marker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl,
        shadowUrl: "assets/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
    }).addTo(this.map)

    marker.bindPopup(title)
    this.markers.push(marker)
  }

  private drawRoute(): void {
    if (this.selectedDeparture && this.selectedDestination) {
      // Clear existing polyline
      if (this.polyline) {
        this.map.removeLayer(this.polyline)
      }

      // Create route points
      const routePoints: L.LatLng[] = [L.latLng(this.selectedDeparture.latitude, this.selectedDeparture.longitude)]

      // Add intermediate stops
      this.intermediateStops.forEach((stop) => {
        routePoints.push(L.latLng(stop.latitude, stop.longitude))
      })

      // Add destination
      routePoints.push(L.latLng(this.selectedDestination.latitude, this.selectedDestination.longitude))

      // Draw polyline
      this.polyline = L.polyline(routePoints, {
        color: "#3f51b5",
        weight: 4,
        opacity: 0.7,
      }).addTo(this.map)

      // Fit map to show all points
      this.map.fitBounds(this.polyline.getBounds(), { padding: [20, 20] })
    }
  }

  private clearMapData(): void {
    // Clear markers
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker)
    })
    this.markers = []

    // Clear polyline
    if (this.polyline) {
      this.map.removeLayer(this.polyline)
      this.polyline = null
    }

    // Reset selections
    this.selectedDeparture = null
    this.selectedDestination = null
    this.intermediateStops = []
  }

  clearMapSelection(): void {
    this.clearMapData()
  }

  onSubmit(): void {
    if (this.isMapMode) {
      this.submitMapBasedItinerary()
    } else {
      this.submitFormBasedItinerary()
    }
  }

  private submitFormBasedItinerary(): void {
    if (this.itineraryForm.valid) {
      const formData = this.itineraryForm.value

      const departure: Stop = {
        stopName: formData.departureStopName,
        latitude: formData.departureLat,
        longitude: formData.departureLng,
        arrivalTime: formData.departureTime,
        estimatedTime: "",
        orderIndex: 0
      }

      const destination: Stop = {
        stopName: formData.destinationStopName,
        latitude: formData.destinationLat,
        longitude: formData.destinationLng,
        arrivalTime: formData.destinationTime,
        estimatedTime: "",
        orderIndex: 0
      }

      this.createItinerary(departure, destination)
    }
  }

  private submitMapBasedItinerary(): void {
    if (this.selectedDeparture && this.selectedDestination) {
      // Prompt for stop names
      const departureName = prompt("Enter departure stop name:", this.selectedDeparture.stopName)
      const destinationName = prompt("Enter destination stop name:", this.selectedDestination.stopName)

      if (departureName && destinationName) {
        this.selectedDeparture.stopName = departureName
        this.selectedDestination.stopName = destinationName

        this.createItinerary(this.selectedDeparture, this.selectedDestination)
      }
    } else {
      this.snackBar.open("Please select both departure and destination points on the map", "Close", { duration: 3000 })
    }
  }

  private createItinerary(departure: Stop, destination: Stop): void {
    this.loading = true

    this.itineraryService.createItinerary(departure, destination).subscribe({
      next: (itinerary) => {
        this.snackBar.open("Itinerary created successfully", "Close", { duration: 3000 })

        // Add intermediate stops if any (map mode)
        if (this.intermediateStops.length > 0 && itinerary.idItinerary) {
          this.itineraryService.addStopsToItinerary(itinerary.idItinerary, this.intermediateStops).subscribe({
            next: () => {
              this.snackBar.open("Intermediate stops added successfully", "Close", { duration: 3000 })
              this.router.navigate(["/itineraries"])
            },
            error: (error) => {
              console.error("Error adding intermediate stops:", error)
              this.router.navigate(["/itineraries"])
            },
          })
        } else {
          this.router.navigate(["/itineraries"])
        }

        this.loading = false
      },
      error: (error) => {
        console.error("Error creating itinerary:", error)
        this.snackBar.open("Error creating itinerary", "Close", { duration: 3000 })
        this.loading = false
      },
    })
  }

  useCurrentLocation(field: "departure" | "destination"): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          if (field === "departure") {
            this.itineraryForm.patchValue({
              departureLat: lat.toFixed(6),
              departureLng: lng.toFixed(6),
            })
          } else {
            this.itineraryForm.patchValue({
              destinationLat: lat.toFixed(6),
              destinationLng: lng.toFixed(6),
            })
          }
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
