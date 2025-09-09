// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-bus-tracking',
//   imports: [],
//   templateUrl: './bus-tracking.component.html',
//   styleUrl: './bus-tracking.component.css'
// })
// export class BusTrackingComponent {

// }








import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core"

import * as L from "leaflet"
import { Itinerary } from "../../entity/itinerary"
import { Bus } from "../../entity/bus"
import { ActivatedRoute } from "@angular/router"

import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
import { BusService } from "../../service/BusService/bus.service"
import { MatSnackBar } from "@angular/material/snack-bar"
import { BusPosition } from "../../entity/busPosition"
import { BusPositionService } from "../../service/BusPositionService/bus-position.service"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatTableModule } from "@angular/material/table"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatOption } from "@angular/material/autocomplete"

@Component({
  selector: "app-bus-tracking",
  templateUrl: "./bus-tracking.component.html",
  styleUrls: ["./bus-tracking.component.css"],
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
export class BusTrackingComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map
  private busMarkers: Map<number, L.Marker> = new Map()
  private stopMarkers: L.Marker[] = []
  private routePolylines: L.Polyline[] = []
  private updateInterval: any

  itineraries: Itinerary[] = []
  buses: Bus[] = []
  selectedItinerary: Itinerary | null = null
  isTracking = false
  loading = false

  constructor(
    private route: ActivatedRoute,
    private busPositionService: BusPositionService,
    private itineraryService: ItineraryService,
    private busService: BusService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadData()

    // Check if specific itinerary is requested
    this.route.queryParams.subscribe((params) => {
      if (params["itinerary"]) {
        const itineraryId = Number.parseInt(params["itinerary"])
        this.loadSpecificItinerary(itineraryId)
      }
    })
  }

  ngAfterViewInit(): void {
    this.initMap()
  }

  ngOnDestroy(): void {
    this.stopTracking()
  }

  private initMap(): void {
    // Initialize map centered on Tunisia
    this.map = L.map("tracking-map").setView([36.8065, 10.1815], 10)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map)

    // Fix for default markers
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "assets/marker-icon-2x.png",
      iconUrl: "assets/marker-icon.png",
      shadowUrl: "assets/marker-shadow.png",
    })
  }

  private loadData(): void {
    this.loading = true

    // Load itineraries
    this.itineraryService.getAllItineraries().subscribe({
      next: (itineraries) => {
        this.itineraries = itineraries
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading itineraries:", error)
        this.snackBar.open("Error loading itineraries", "Close", { duration: 3000 })
        this.loading = false
      },
    })

    // Load buses
    this.busService.getAllBuses().subscribe({
      next: (buses) => {
        this.buses = buses
      },
      error: (error) => {
        console.error("Error loading buses:", error)
      },
    })
  }

  private loadSpecificItinerary(itineraryId: number): void {
    const itinerary = this.itineraries.find((i) => i.idItinerary === itineraryId)
    if (itinerary) {
      this.selectedItinerary = itinerary
      this.displayItineraryOnMap()
    }
  }

  onItinerarySelect(): void {
    if (this.selectedItinerary) {
      this.displayItineraryOnMap()
      if (this.isTracking) {
        this.startTracking()
      }
    }
  }

  private displayItineraryOnMap(): void {
    if (!this.selectedItinerary || !this.map) return

    // Clear existing markers and polylines
    this.clearMapElements()

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
          ${stop.estimatedTime ? `Estimated: ${stop.estimatedTime}` : ""}
        `)

        this.stopMarkers.push(marker)
      })

      // Draw route polyline
      const routePoints = this.selectedItinerary.stops.map((stop) => L.latLng(stop.latitude, stop.longitude))

      const polyline = L.polyline(routePoints, {
        color: "#3f51b5",
        weight: 4,
        opacity: 0.7,
      }).addTo(this.map)

      this.routePolylines.push(polyline)

      // Fit map to show all stops
      this.map.fitBounds(polyline.getBounds(), { padding: [20, 20] })
    }
  }

  private clearMapElements(): void {
    // Clear stop markers
    this.stopMarkers.forEach((marker) => {
      this.map.removeLayer(marker)
    })
    this.stopMarkers = []

    // Clear route polylines
    this.routePolylines.forEach((polyline) => {
      this.map.removeLayer(polyline)
    })
    this.routePolylines = []

    // Clear bus markers
    this.busMarkers.forEach((marker) => {
      this.map.removeLayer(marker)
    })
    this.busMarkers.clear()
  }

  startTracking(): void {
    if (!this.selectedItinerary || !this.selectedItinerary.buses) {
      this.snackBar.open("Please select an itinerary with assigned buses", "Close", { duration: 3000 })
      return
    }

    this.isTracking = true
    this.updateBusPositions()

    // Update positions every 5 seconds
    this.updateInterval = setInterval(() => {
      this.updateBusPositions()
    }, 5000)

    this.snackBar.open("Real-time tracking started", "Close", { duration: 2000 })
  }

  stopTracking(): void {
    this.isTracking = false

    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }

    // Clear bus markers
    this.busMarkers.forEach((marker) => {
      this.map.removeLayer(marker)
    })
    this.busMarkers.clear()

    this.snackBar.open("Tracking stopped", "Close", { duration: 2000 })
  }

  private updateBusPositions(): void {
    if (!this.selectedItinerary || !this.selectedItinerary.buses) return

    this.selectedItinerary.buses.forEach((bus) => {
      if (bus.idBus) {
        this.busPositionService.getLatestLocation(bus.idBus).subscribe({
          next: (position: BusPosition) => {
            this.updateBusMarker(bus, position)
          },
          error: (error) => {
            console.error(`Error getting position for bus ${bus.idBus}:`, error)
          },
        })
      }
    })
  }

  private updateBusMarker(bus: Bus, position: BusPosition): void {
    if (!bus.idBus) return

    // Remove existing marker if it exists
    if (this.busMarkers.has(bus.idBus)) {
      this.map.removeLayer(this.busMarkers.get(bus.idBus)!)
    }

    // Create new bus marker
    const busIcon = L.icon({
      iconUrl: "assets/bus-icon.png",
      shadowUrl: "assets/marker-shadow.png",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    })

    const marker = L.marker([position.latitude, position.longitude], {
      icon: busIcon,
    }).addTo(this.map)

    marker.bindPopup(`
      <b>Bus ${bus.matricule}</b><br>
      Brand: ${bus.marque}<br>
      Last Update: ${new Date(position.time).toLocaleTimeString()}
    `)

    this.busMarkers.set(bus.idBus, marker)
  }

  getAssignedBuses(): Bus[] {
    return this.selectedItinerary?.buses || []
  }

  getBusDistance(bus: Bus): void {
    if (!bus.idBus || !this.selectedItinerary?.stops?.[0]) return

    const firstStopId = this.selectedItinerary.stops[0].idStop
    if (firstStopId) {
      this.busPositionService.getDistanceBusToStop(bus.idBus, firstStopId).subscribe({
        next: (distance) => {
          this.snackBar.open(`Bus ${bus.matricule} is ${distance.toFixed(0)}m from next stop`, "Close", {
            duration: 3000,
          })
        },
        error: (error) => {
          console.error("Error getting distance:", error)
        },
      })
    }
  }
}
