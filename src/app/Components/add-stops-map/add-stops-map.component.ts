import { Component, OnInit, Input } from "@angular/core"

import * as L from "leaflet"
import { Stop } from "../../entity/stop"
import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-add-stops-map",
  templateUrl: "./add-stops-map.component.html",
  styleUrls: ["./add-stops-map.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AddStopsMapComponent implements OnInit {
  @Input() itineraryId!: number

  private map!: L.Map
  selectedStops: Stop[] = []
  private stopMarkers: L.Marker[] = []
  isLoading = false
  errorMessage: string | null = null
  private nextOrderIndex = 1

  constructor(private itineraryService: ItineraryService) {}

  ngOnInit(): void {
    if (!this.itineraryId) {
      this.errorMessage = "Itinerary ID is required to add stops."
      return
    }
    this.initMap()
  }

  private initMap(): void {
    // Initialize the map
    this.map = L.map("map").setView([36.8, 10.1], 7)

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "© OpenStreetMap contributors",
    }).addTo(this.map)

    // Add click event listener
    this.map.on("click", (e: L.LeafletMouseEvent) => {
      this.onMapClick(e)
    })
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    const lat = e.latlng.lat
    const lng = e.latlng.lng

    this.getPlaceName(lat, lng).then((placeName: string) => {
      this.addStop(lat, lng, placeName)
    })
  }

  private addStop(lat: number, lng: number, placeName: string): void {
    const newStop: Stop = {
      stopName: placeName,
      latitude: lat,
      longitude: lng,
      estimatedTime: "12:00:00",
      arrivalTime: null,
      orderIndex: this.nextOrderIndex,
    }

    this.selectedStops.push(newStop)
    this.nextOrderIndex++

    // Create marker with numbered icon
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
    const colorIndex = (this.selectedStops.length - 1) % colors.length
    const color = colors[colorIndex]

    const stopIcon = L.divIcon({
      html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${this.selectedStops.length}</div>`,
      iconSize: [25, 25],
      className: "custom-div-icon",
    })

    const marker = L.marker([lat, lng], { icon: stopIcon })
      .bindPopup(`<strong>🚩 Stop ${this.selectedStops.length}:</strong><br>${placeName}`)
      .addTo(this.map)
      .openPopup()

    this.stopMarkers.push(marker)
  }

  removeStop(index: number): void {
    if (index >= 0 && index < this.selectedStops.length) {
      // Remove stop from array
      this.selectedStops.splice(index, 1)

      // Remove marker from map
      if (this.stopMarkers[index]) {
        this.map.removeLayer(this.stopMarkers[index])
      }
      this.stopMarkers.splice(index, 1)

      // Update order indices and marker numbers
      this.updateStopIndices()
      this.updateMarkerNumbers()
    }
  }

  private updateStopIndices(): void {
    this.selectedStops.forEach((stop, index) => {
      stop.orderIndex = index + 1
    })
    this.nextOrderIndex = this.selectedStops.length + 1
  }

  private updateMarkerNumbers(): void {
    // Remove all markers and recreate them with updated numbers
    this.stopMarkers.forEach((marker) => {
      this.map.removeLayer(marker)
    })
    this.stopMarkers = []

    this.selectedStops.forEach((stop, index) => {
      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
      const colorIndex = index % colors.length
      const color = colors[colorIndex]

      const stopIcon = L.divIcon({
        html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">${index + 1}</div>`,
        iconSize: [25, 25],
        className: "custom-div-icon",
      })

      const marker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
        .bindPopup(`<strong>🚩 Stop ${index + 1}:</strong><br>${stop.stopName}`)
        .addTo(this.map)

      this.stopMarkers.push(marker)
    })
  }

  private async getPlaceName(lat: number, lng: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    try {
      const response = await fetch(url)
      const data = await response.json()
      return data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
    } catch (error) {
      console.error("Failed to get place name:", error)
      return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
    }
  }

  submitStops(): void {
    if (this.selectedStops.length === 0) {
      this.errorMessage = "Please select at least one stop to add."
      return
    }

    this.isLoading = true
    this.errorMessage = null

    this.itineraryService.addStopsToItinerary(this.itineraryId, this.selectedStops).subscribe({
      next: () => {
        console.log("Stops added successfully")
        alert(`✅ ${this.selectedStops.length} stop(s) added successfully to the itinerary!`)
        this.reset()
      },
      error: (err) => {
        console.error("Failed to add stops:", err)

        let errorMsg = "Failed to add stops. Please try again."
        if (err.status === 400) {
          errorMsg = "Invalid data provided. Please check your selections."
        } else if (err.status === 500) {
          errorMsg = "Server error occurred. Please try again later."
        }

        this.errorMessage = errorMsg
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      },
    })
  }

  reset(): void {
    this.selectedStops = []
    this.nextOrderIndex = 1
    this.errorMessage = null

    // Remove all markers
    this.stopMarkers.forEach((marker) => {
      this.map.removeLayer(marker)
    })
    this.stopMarkers = []
  }

  canSubmit(): boolean {
    return this.selectedStops.length > 0 && !this.isLoading
  }

  dismissError(): void {
    this.errorMessage = null
  }
}
