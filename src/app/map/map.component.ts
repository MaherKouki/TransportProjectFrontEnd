

// import { Component, OnInit } from '@angular/core';
// import * as L from 'leaflet';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-map',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.css']
// })
// export class MapComponent implements OnInit {
//   map!: L.Map;
//   marker!: L.Marker;
//   vitesse: number = 1000; // delay in ms between movements
//   selectedPosition: L.LatLng | null = null;

//   constructor() {}

//   ngOnInit(): void {
//     this.initMap();

//     const positions: L.LatLng[] = [
//       L.latLng(35.8256, 10.6084), // Sousse
//       L.latLng(35.9, 10.5),
//       L.latLng(36.0, 10.4),
//       L.latLng(36.2, 10.3),
//       L.latLng(36.4, 10.25),
//       L.latLng(36.6, 10.2),
//       L.latLng(36.8, 10.15),
//       L.latLng(37, 10.1),
//       L.latLng(36.8065, 10.1815), // Tunis
//     ];

//     this.drawRoute(positions);
//     // this.animateBus(positions);
//   }

//   initMap(): void {
//     this.map = L.map('map').setView([35.8256, 10.6084], 8);

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       attribution: '© OpenStreetMap contributors'
//     }).addTo(this.map);

//     // ✅ Click listener to select a position
//     this.map.on('click', (e: L.LeafletMouseEvent) => {
//       this.selectedPosition = e.latlng;

//       // Remove old marker if exists
//       if (this.marker) {
//         this.map.removeLayer(this.marker);
//       }

//       // Add marker at clicked position
//       const customIcon = L.icon({
//       iconUrl: '/marker1.png', // ✅ your image path here
//       iconSize: [40, 40],              // adjust as needed
//       iconAnchor: [20, 40],            // anchor point of the icon
//       shadowUrl: '',                   // optional: remove shadow
//     });

//     this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map);
//     });
//   }

//   drawRoute(positions: L.LatLng[]) {
//     L.polyline(positions, { color: 'blue' }).addTo(this.map);
//     this.map.fitBounds(L.polyline(positions).getBounds());

//     const busIcon = L.icon({
//       iconUrl: '/bus6.jpg', // make sure this image exists in src/assets
//       iconSize: [40, 40],
//       iconAnchor: [20, 40]
//     });

    
//     this.marker = L.marker(positions[0], { icon: busIcon }).addTo(this.map);  // Create initial marker (this will be replaced on click)
//   }

//   animateBus(route: L.LatLng[]) {
//     let i = 0;
//     const interval = setInterval(() => {
//       if (i < route.length) {
//         this.marker.setLatLng(route[i]);
//         i++;
//       } else {
//         clearInterval(interval);
//       }
//     }, this.vitesse);
//   }

//   logPosition() {
//     if (this.selectedPosition) {
//       console.log('Latitude:', this.selectedPosition.lat);
//       console.log('Longitude:', this.selectedPosition.lng);
//     } else {
//       console.log('Aucune position sélectionnée');
//     }
//   }
// }

















//////// neeeeww neww

// import { Component, type OnInit } from "@angular/core"
// import * as L from "leaflet"


// import { CommonModule } from "@angular/common"
// import { FormsModule } from "@angular/forms"
// import { Stop } from "../entity/stop"
// import { ItineraryServiceService } from "../service/itinerary-service.service"
// import { Itinerary } from "../entity/itinerary"

// @Component({
//   selector: "app-map",
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: "./map.component.html",
//   styleUrls: ["./map.component.css"],
// })
// export class MapComponent implements OnInit {
//   map!: L.Map
//   departure: Stop | null = null
//   destination: Stop | null = null
//   departureMarker: L.Marker | null = null
//   destinationMarker: L.Marker | null = null
//   currentStep: "departure" | "destination" = "departure"

//   constructor(private itineraryService: ItineraryServiceService) {}

//   ngOnInit(): void {
//     this.initMap()
//   }

//   initMap(): void {
//     this.map = L.map("map").setView([36.8, 10.1], 7) // Default center: Tunisia

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       maxZoom: 18,
//       attribution: "© OpenStreetMap contributors",
//     }).addTo(this.map)

//     this.map.on("click", (e: L.LeafletMouseEvent) => this.onMapClick(e))
//   }

//   onMapClick(e: L.LeafletMouseEvent): void {
//     const lat = e.latlng.lat
//     const lng = e.latlng.lng

//     this.getPlaceName(lat, lng).then((placeName: string) => {
//       if (this.currentStep === "departure") {
//         this.setDeparture(lat, lng, placeName)
//       } else if (this.currentStep === "destination") {
//         this.setDestination(lat, lng, placeName)
//       }
//     })
//   }

//   setDeparture(lat: number, lng: number, placeName: string): void {
//     // Remove existing departure marker if any
//     if (this.departureMarker) {
//       this.map.removeLayer(this.departureMarker)
//     }

//     this.departure = {
//       stopName: placeName,
//       latitude: lat,
//       longitude: lng,
//       estimatedTime: "08:00:00",
//       arrivalTime: 0,
//       orderIndex: 0,
//       itinerary: {} as Itinerary,
//     }

//     // Create green marker for departure
//     const departureIcon = L.divIcon({
//       html: '<div style="background-color: #22c55e; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
//       iconSize: [20, 20],
//       className: "custom-div-icon",
//     })

//     this.departureMarker = L.marker([lat, lng], { icon: departureIcon })
//       .bindPopup(`<strong>Départ:</strong><br>${placeName}`)
//       .addTo(this.map)
//       .openPopup()

//     this.currentStep = "destination"
//   }

//   setDestination(lat: number, lng: number, placeName: string): void {
//     // Remove existing destination marker if any
//     if (this.destinationMarker) {
//       this.map.removeLayer(this.destinationMarker)
//     }

//     this.destination = {
//       stopName: placeName,
//       latitude: lat,
//       longitude: lng,
//       estimatedTime: "18:00:00",
//       arrivalTime: 0,
//       orderIndex: 1,
//       itinerary: {} as Itinerary,
//     }

//     // Create red marker for destination
//     const destinationIcon = L.divIcon({
//       html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
//       iconSize: [20, 20],
//       className: "custom-div-icon",
//     })

//     this.destinationMarker = L.marker([lat, lng], { icon: destinationIcon })
//       .bindPopup(`<strong>Destination:</strong><br>${placeName}`)
//       .addTo(this.map)
//       .openPopup()
//   }

//   async getPlaceName(lat: number, lng: number): Promise<string> {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
//     try {
//       const response = await fetch(url)
//       const data = await response.json()
//       return data.display_name || `Lat: ${lat}, Lng: ${lng}`
//     } catch (error) {
//       console.error("Failed to get place name:", error)
//       return `Lat: ${lat}, Lng: ${lng}`
//     }
//   }

//   submitItinerary(): void {
//     if (!this.departure || !this.destination) {
//       alert("Veuillez sélectionner les points de départ et de destination.")
//       return
//     }

//     const stops: Stop[] = [this.departure, this.destination]

//     this.itineraryService.createItinerary(stops).subscribe({
//       next: (result) => {
//         console.log("Itinerary created successfully:", result)
//         alert(`Itinéraire "${result.itineraryName}" créé avec succès!`)
//         this.reset()
//       },
//       error: (err) => {
//         console.error("Failed to create itinerary:", err)
//         alert("Erreur lors de la création de l'itinéraire. Veuillez réessayer.")
//       },
//     })
//   }

//   reset(): void {
//     this.departure = null
//     this.destination = null
//     this.currentStep = "departure"

//     if (this.departureMarker) {
//       this.map.removeLayer(this.departureMarker)
//       this.departureMarker = null
//     }

//     if (this.destinationMarker) {
//       this.map.removeLayer(this.destinationMarker)
//       this.destinationMarker = null
//     }
//   }

//   switchToDepartureSelection(): void {
//     this.currentStep = "departure"
//   }

//   switchToDestinationSelection(): void {
//     this.currentStep = "destination"
//   }

//   canSubmit(): boolean {
//     return this.departure !== null && this.destination !== null
//   }
// }





















// import { Component, type OnInit } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { FormsModule } from "@angular/forms"
// import * as L from "leaflet"
// import { Stop } from "../entity/stop"
// import { ItineraryServiceService } from "../service/itinerary-service.service"
// //import { ItineraryServiceService } from "../service/itinerary-service.service"


// @Component({
//   selector: "app-map",
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: "./map.component.html",
//   styleUrls: ["./map.component.css"],
// })
// export class MapComponent implements OnInit {
//   map!: L.Map
//   departure: Stop | null = null
//   destination: Stop | null = null
//   departureMarker: L.Marker | null = null
//   destinationMarker: L.Marker | null = null
//   currentStep: "departure" | "destination" = "departure"
//   isLoading = false

//   constructor(private itineraryService: ItineraryServiceService) {}

//   ngOnInit(): void {
//     this.initMap()
//   }

//   initMap(): void {
//     this.map = L.map("map").setView([36.8, 10.1], 7)

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       maxZoom: 18,
//       attribution: "© OpenStreetMap contributors",
//     }).addTo(this.map)

//     this.map.on("click", (e: L.LeafletMouseEvent) => this.onMapClick(e))
//   }

//   onMapClick(e: L.LeafletMouseEvent): void {
//     const lat = e.latlng.lat
//     const lng = e.latlng.lng

//     this.getPlaceName(lat, lng).then((placeName: string) => {
//       if (this.currentStep === "departure") {
//         this.setDeparture(lat, lng, placeName)
//       } else {
//         this.setDestination(lat, lng, placeName)
//       }
//     })
//   }

//   setDeparture(lat: number, lng: number, placeName: string): void {
//     if (this.departureMarker) {
//       this.map.removeLayer(this.departureMarker)
//     }

//     this.departure = {
//       stopName: placeName,
//       latitude: lat,
//       longitude: lng,
//       estimatedTime: "08:00:00",
//       orderIndex: 0,
//     }

//     const departureIcon = L.divIcon({
//       html: '<div style="background-color: #22c55e; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
//       iconSize: [25, 25],
//       className: "custom-div-icon",
//     })

//     this.departureMarker = L.marker([lat, lng], { icon: departureIcon })
//       .bindPopup(`<strong>🚀 Departure:</strong><br>${placeName}`)
//       .addTo(this.map)
//       .openPopup()

//     this.currentStep = "destination"
//   }

//   setDestination(lat: number, lng: number, placeName: string): void {
//     if (this.destinationMarker) {
//       this.map.removeLayer(this.destinationMarker)
//     }

//     this.destination = {
//       stopName: placeName,
//       latitude: lat,
//       longitude: lng,
//       estimatedTime: "18:00:00",
//       orderIndex: 1,
//     }

//     const destinationIcon = L.divIcon({
//       html: '<div style="background-color: #ef4444; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
//       iconSize: [25, 25],
//       className: "custom-div-icon",
//     })

//     this.destinationMarker = L.marker([lat, lng], { icon: destinationIcon })
//       .bindPopup(`<strong>🎯 Destination:</strong><br>${placeName}`)
//       .addTo(this.map)
//       .openPopup()
//   }

//   async getPlaceName(lat: number, lng: number): Promise<string> {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
//     try {
//       const response = await fetch(url)
//       const data = await response.json()
//       return data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
//     } catch (error) {
//       console.error("Failed to get place name:", error)
//       return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
//     }
//   }

//   submitItinerary(): void {
//     if (!this.departure || !this.destination) {
//       alert("Please select both departure and destination points.")
//       return
//     }

//     this.isLoading = true

//     const request: CreateItineraryRequest = {
//       departure: this.departure,
//       destination: this.destination,
//     }

//     console.log("Submitting itinerary request:", request)

//     this.itineraryService.createItinerary(request).subscribe({
//       next: (result) => {
//         console.log("Itinerary created successfully:", result)
//         alert(`✅ Itinerary "${result.itineraryName}" created successfully!`)
//         this.reset()
//         this.isLoading = false
//       },
//       error: (err) => {
//         console.error("Failed to create itinerary:", err)
//         alert("❌ Error creating itinerary. Please try again.")
//         this.isLoading = false
//       },
//     })
//   }

//   reset(): void {
//     this.departure = null
//     this.destination = null
//     this.currentStep = "departure"

//     if (this.departureMarker) {
//       this.map.removeLayer(this.departureMarker)
//       this.departureMarker = null
//     }

//     if (this.destinationMarker) {
//       this.map.removeLayer(this.destinationMarker)
//       this.destinationMarker = null
//     }
//   }

//   switchToDepartureSelection(): void {
//     this.currentStep = "departure"
//   }

//   switchToDestinationSelection(): void {
//     this.currentStep = "destination"
//   }

//   canSubmit(): boolean {
//     return this.departure !== null && this.destination !== null && !this.isLoading
//   }
// }



// import { Component, type OnInit } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { FormsModule } from "@angular/forms"
// import * as L from "leaflet"
// import { Stop } from "../entity/stop"
// import { ItineraryServiceService, CreateItineraryRequest } from "../service/itinerary-service.service"

// @Component({
//   selector: "app-map",
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: "./map.component.html",
//   styleUrls: ["./map.component.css"],
// })
// export class MapComponent implements OnInit {
//   map!: L.Map
//   departure: Stop | null = null
//   destination: Stop | null = null
//   departureMarker: L.Marker | null = null
//   destinationMarker: L.Marker | null = null
//   currentStep: "departure" | "destination" = "departure"
//   isLoading = false
//   errorMessage: string | null = null  // Add this property

//   constructor(private itineraryService: ItineraryServiceService) {}

//   ngOnInit(): void {
//     this.initMap()
//   }

//   initMap(): void {
//     this.map = L.map("map").setView([36.8, 10.1], 7)

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       maxZoom: 18,
//       attribution: "© OpenStreetMap contributors",
//     }).addTo(this.map)

//     this.map.on("click", (e: L.LeafletMouseEvent) => this.onMapClick(e))
//   }

//   onMapClick(e: L.LeafletMouseEvent): void {
//     const lat = e.latlng.lat
//     const lng = e.latlng.lng

//     this.getPlaceName(lat, lng).then((placeName: string) => {
//       if (this.currentStep === "departure") {
//         this.setDeparture(lat, lng, placeName)
//       } else {
//         this.setDestination(lat, lng, placeName)
//       }
//     })
//   }

//   setDeparture(lat: number, lng: number, placeName: string): void {
//     if (this.departureMarker) {
//       this.map.removeLayer(this.departureMarker)
//     }

//     // Create departure stop object matching backend expectations
//     this.departure = {
//       stopName: placeName,
//       latitude: lat,
//       longitude: lng,
//       estimatedTime: "08:00:00",
//       orderIndex: 0,
//     }

//     const departureIcon = L.divIcon({
//       html: '<div style="background-color: #22c55e; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
//       iconSize: [25, 25],
//       className: "custom-div-icon",
//     })

//     this.departureMarker = L.marker([lat, lng], { icon: departureIcon })
//       .bindPopup(`<strong>🚀 Departure:</strong><br>${placeName}`)
//       .addTo(this.map)
//       .openPopup()

//     this.currentStep = "destination"
//   }

//   setDestination(lat: number, lng: number, placeName: string): void {
//     if (this.destinationMarker) {
//       this.map.removeLayer(this.destinationMarker)
//     }

//     // Create destination stop object matching backend expectations
//     this.destination = {
//       stopName: placeName,
//       latitude: lat,
//       longitude: lng,
//       estimatedTime: "18:00:00",
//       orderIndex: 1,
//     }

//     const destinationIcon = L.divIcon({
//       html: '<div style="background-color: #ef4444; width: 25px; height: 25px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
//       iconSize: [25, 25],
//       className: "custom-div-icon",
//     })

//     this.destinationMarker = L.marker([lat, lng], { icon: destinationIcon })
//       .bindPopup(`<strong>🎯 Destination:</strong><br>${placeName}`)
//       .addTo(this.map)
//       .openPopup()
//   }

//   async getPlaceName(lat: number, lng: number): Promise<string> {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
//     try {
//       const response = await fetch(url)
//       const data = await response.json()
//       return data.display_name || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
//     } catch (error) {
//       console.error("Failed to get place name:", error)
//       return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
//     }
//   }

//   submitItinerary(): void {
//     if (!this.departure || !this.destination) {
//       this.setError("Please select both departure and destination points.")
//       return
//     }

//     this.isLoading = true
//     this.clearError()

//     console.log("Submitting itinerary with stops:", {
//       departure: this.departure,
//       destination: this.destination
//     })

//     // Use the new method that saves stops first, then creates itinerary
//     this.itineraryService.createItineraryWithStops(this.departure, this.destination).subscribe({
//       next: (result) => {
//         console.log("Itinerary created successfully:", result)
//         alert(`✅ Itinerary "${result.itineraryName}" created successfully!`)
//         this.reset()
//         this.isLoading = false
//       },
//       error: (err) => {
//         console.error("Failed to create itinerary:", err)
        
//         // More detailed error handling
//         let errorMessage = "Failed to create itinerary. Please try again."
        
//         if (err.status === 400) {
//           errorMessage = "Invalid data provided. Please check your selections."
//         } else if (err.status === 500) {
//           errorMessage = "Server error occurred. Please try again later."
//         } else if (err.error && err.error.message) {
//           errorMessage = err.error.message
//         }
        
//         this.setError(errorMessage)
//         this.isLoading = false
//       },
//     })
//   }

//   // Add error handling methods
//   setError(message: string): void {
//     this.errorMessage = message
//   }

//   clearError(): void {
//     this.errorMessage = null
//   }

//   reset(): void {
//     this.departure = null
//     this.destination = null
//     this.currentStep = "departure"

//     if (this.departureMarker) {
//       this.map.removeLayer(this.departureMarker)
//       this.departureMarker = null
//     }

//     if (this.destinationMarker) {
//       this.map.removeLayer(this.destinationMarker)
//       this.destinationMarker = null
//     }
//   }

//   switchToDepartureSelection(): void {
//     this.currentStep = "departure"
//   }

//   switchToDestinationSelection(): void {
//     this.currentStep = "destination"
//   }

//   canSubmit(): boolean {
//     return this.departure !== null && this.destination !== null && !this.isLoading
//   }
// }






























import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import * as L from "leaflet"
import { Stop } from "../entity/stop"
import { ItineraryServiceService } from "../service/itinerary-service.service"

@Component({
  selector: "app-map",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnInit {
  map!: L.Map
  departure: Stop | null = null
  destination: Stop | null = null
  departureMarker: L.Marker | null = null
  destinationMarker: L.Marker | null = null
  currentStep: "departure" | "destination" = "departure"
  isLoading = false
  errorMessage: string | null = null

  constructor(private itineraryService: ItineraryServiceService) {}

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