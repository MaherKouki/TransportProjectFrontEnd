import { Component, OnInit } from "@angular/core"
import * as L from "leaflet"
import { Stop } from "../../entity/stop"
import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
import { ActivatedRoute } from "@angular/router"
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
  itineraryId!: number

  private map!: L.Map
  selectedStops: Stop[] = []
  private stopMarkers: L.Marker[] = []
  isLoading = false
  errorMessage: string | null = null
  private nextOrderIndex = 1

  constructor(
    private itineraryService: ItineraryService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id")
    if (!idParam) {
      this.errorMessage = "Itinerary ID is required in the URL."
      return
    }

    this.itineraryId = Number(idParam)
    if (isNaN(this.itineraryId)) {
      this.errorMessage = "Invalid itinerary ID in the URL."
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

  async onMapClick(e: L.LeafletMouseEvent): Promise<void> {
    const { lat, lng } = e.latlng;
    
    try {
      // Get the place name using reverse geocoding
      const placeName = await this.getPlaceName(lat, lng);
      
      // Create a new stop with the actual place name
      const newStop: Stop = {
        stopName: placeName,
        latitude: lat,
        longitude: lng,
        estimatedTime: null,
        arrivalTime: null,
        orderIndex: this.nextOrderIndex
      };

      // Add the stop to the selected stops array
      this.selectedStops.push(newStop);
      
      // Create a custom marker icon (similar to your itinerary component)
      const stopIcon = L.divIcon({
        html: `<div style="background-color: #3b82f6; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">${this.nextOrderIndex}</div>`,
        iconSize: [25, 25],
        className: "custom-div-icon",
      });
      
      // Create a marker for the new stop
      const marker = L.marker([lat, lng], { icon: stopIcon })
        .addTo(this.map)
        .bindPopup(`<strong>📍 Stop ${this.nextOrderIndex}:</strong><br>${placeName}`)
        .openPopup();
      
      // Store the marker reference
      this.stopMarkers.push(marker);
      
      // Increment the order index for the next stop
      this.nextOrderIndex++;
      
      console.log('New stop added:', newStop);
    } catch (error) {
      console.error('Error adding stop:', error);
      this.errorMessage = "Failed to get location information. Please try again.";
    }
  }

  // Add the getPlaceName method from your ItineraryMapComponent
  async getPlaceName(lat: number, lng: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    } catch (error) {
      console.error("Failed to get place name:", error);
      return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    }
  }

  reset(): void {
    // Clear selected stops
    this.selectedStops = [];
    
    // Remove all markers from the map
    this.stopMarkers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    
    // Clear marker references
    this.stopMarkers = [];
    
    // Reset the order index
    this.nextOrderIndex = 1;
    
    // Clear any error messages
    this.errorMessage = null;
    
    console.log('Component reset successfully');
  }

  removeStop(index: number): void {
    // Remove from selected stops
    this.selectedStops.splice(index, 1);
    
    // Remove corresponding marker
    if (this.stopMarkers[index]) {
      this.map.removeLayer(this.stopMarkers[index]);
      this.stopMarkers.splice(index, 1);
    }
    
    console.log(`Stop at index ${index} removed`);
  }

  canSubmit(): boolean {
    return this.selectedStops.length > 0 && !this.isLoading;
  }

  dismissError(): void {
    this.errorMessage = null;
  }

  // Additional method to update stop names if needed
  updateStopName(index: number, newName: string): void {
    if (this.selectedStops[index]) {
      this.selectedStops[index].stopName = newName;
      
      // Update the popup content for the corresponding marker
      if (this.stopMarkers[index]) {
        this.stopMarkers[index].setPopupContent(`<strong>📍 Stop ${index + 1}:</strong><br>${newName}`);
      }
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
        } else if (err.error && err.error.message) {
          errorMsg = err.error.message;
        } else if (typeof err.error === 'string') {
          errorMsg = err.error;
        }

        this.errorMessage = errorMsg
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      },
    })
  }
}