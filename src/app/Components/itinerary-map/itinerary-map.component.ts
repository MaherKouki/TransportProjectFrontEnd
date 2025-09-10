import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Stop } from '../../entity/stop';

import * as L from 'leaflet';

import { ItineraryService } from '../../service/ItineraryService/itinerary.service';


@Component({
  selector: 'app-itinerary-map',

  templateUrl: './itinerary-map.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './itinerary-map.component.css'
})
export class ItineraryMapComponent implements OnInit{


  map!: L.Map
    departure: Stop | null = null
    destination: Stop | null = null
    departureMarker: L.Marker | null = null
    destinationMarker: L.Marker | null = null
    currentStep: "departure" | "destination" = "departure"
    isLoading = false
    errorMessage: string | null = null
  
    constructor(private itineraryService: ItineraryService) {}
  
    ngOnInit(): void {
      this.initMap()
    }
  
    initMap(): void {
      this.map = L.map("map").setView([36.8, 10.1], 7)
  
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap contributors",
      }).addTo(this.map)
  
      this.map.on("click", (e: L.LeafletMouseEvent) => this.onMapClick(e))
    }
  
    onMapClick(e: L.LeafletMouseEvent): void {
      const lat = e.latlng.lat
      const lng = e.latlng.lng
  
      this.getPlaceName(lat, lng).then((placeName: string) => {
        if (this.currentStep === "departure") {
          this.setDeparture(lat, lng, placeName)
        } else {
          this.setDestination(lat, lng, placeName)
        }
      })
    }
  
    setDeparture(lat: number, lng: number, placeName: string): void {
      if (this.departureMarker) {
        this.map.removeLayer(this.departureMarker)
      }
  
      // Create departure stop object matching backend expectations
      this.departure = {
        stopName: placeName,
        latitude: lat,
        longitude: lng,
        estimatedTime: "08:00:00", // This should be a string in HH:mm:ss format
        arrivalTime: null, // Add this if your entity has it
        orderIndex: 0,
      }
  
      const departureIcon = L.divIcon({
        html: '<div style="background-color: #22c55e; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [25, 25],
        className: "custom-div-icon",
      })
  
      this.departureMarker = L.marker([lat, lng], { icon: departureIcon })
        .bindPopup(`<strong>🚀 Departure:</strong><br>${placeName}`)
        .addTo(this.map)
        .openPopup()
  
      this.currentStep = "destination"
    }
  
    setDestination(lat: number, lng: number, placeName: string): void {
      if (this.destinationMarker) {
        this.map.removeLayer(this.destinationMarker)
      }
  
      // Create destination stop object matching backend expectations
      this.destination = {
        stopName: placeName,
        latitude: lat,
        longitude: lng,
        estimatedTime: "18:00:00", // This should be a string in HH:mm:ss format
        arrivalTime: null, // Add this if your entity has it
        orderIndex: 1,
      }
  
      const destinationIcon = L.divIcon({
        html: '<div style="background-color: #ef4444; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [25, 25],
        className: "custom-div-icon",
      })
  
      this.destinationMarker = L.marker([lat, lng], { icon: destinationIcon })
        .bindPopup(`<strong>🎯 Destination:</strong><br>${placeName}`)
        .addTo(this.map)
        .openPopup()
    }
  
    async getPlaceName(lat: number, lng: number): Promise<string> {
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
  
    submitItinerary(): void {
      if (!this.departure || !this.destination) {
        this.setError("Please select both departure and destination points.")
        return
      }
  
      this.isLoading = true
      this.clearError()
  
      console.log("Submitting itinerary with stops:", {
        departure: this.departure,
        destination: this.destination
      })
  
      // Use the simplified method that matches your backend service
      this.itineraryService.createItineraryWithStops(this.departure, this.destination).subscribe({
        next: (result) => {
          console.log("Itinerary created successfully:", result)
          alert(`✅ Itinerary "${result.itineraryName}" created successfully!`)
          this.reset()
          this.isLoading = false
        },
        error: (err) => {
          console.error("Failed to create itinerary:", err)
          
          // More detailed error handling
          let errorMessage = "Failed to create itinerary. Please try again."
          
          if (err.status === 400) {
            errorMessage = "Invalid data provided. Please check your selections."
          } else if (err.status === 500) {
            errorMessage = "Server error occurred. Please try again later."
          } else if (err.error && err.error.message) {
            errorMessage = err.error.message
          } else if (typeof err.error === 'string') {
            errorMessage = err.error
          }
          
          this.setError(errorMessage)
          this.isLoading = false
        },
      })
    }
  
    // Add error handling methods
    setError(message: string): void {
      this.errorMessage = message
    }
  
    clearError(): void {
      this.errorMessage = null
    }
  
    reset(): void {
      this.departure = null
      this.destination = null
      this.currentStep = "departure"
      this.clearError()
  
      if (this.departureMarker) {
        this.map.removeLayer(this.departureMarker)
        this.departureMarker = null
      }
  
      if (this.destinationMarker) {
        this.map.removeLayer(this.destinationMarker)
        this.destinationMarker = null
      }
    }
  
    switchToDepartureSelection(): void {
      this.currentStep = "departure"
    }
  
    switchToDestinationSelection(): void {
      this.currentStep = "destination"
    }
  
    canSubmit(): boolean {
      return this.departure !== null && this.destination !== null && !this.isLoading
    }

}
