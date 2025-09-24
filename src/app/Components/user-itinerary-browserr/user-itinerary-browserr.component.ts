import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatChip, MatChipsModule } from "@angular/material/chips"
import { HttpClientModule } from "@angular/common/http"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { RouteDetailsComponent } from "../route-details/route-details.component"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { Itinerary } from "../../entity/itinerary"
//import { Stop } from "../../entity/stop"
import { Bus } from "../../entity/bus"
import { BusPosition } from "../../entity/busPosition"
import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
import { StopService } from "../../service/StopService/stop.service"
import { BusPositionService } from "../../service/BusPositionService/bus-position.service"
import * as L from 'leaflet'
import { Stop } from "../../entity/stop"

@Component({
  selector: "app-user-itinerary-browserr",
  templateUrl: "./user-itinerary-browserr.component.html",
  styleUrls: ["./user-itinerary-browserr.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatChip,
    MatDialogModule,
    MatSnackBarModule,
    HttpClientModule,
  ],
})
export class UserItineraryBrowserrComponent implements OnInit {
  searchQuery = ""
  loading = false
  showSuggestions = false
  filteredSuggestions: Stop[] = []
  
  // Data arrays
  itineraries: Itinerary[] = []
  allStops: Stop[] = []
  
  // User selection workflow
  selectedDestinationStop: Stop | null = null
  selectedItinerary: Itinerary | null = null
  
  // Location and distance tracking
  userLocation: { latitude: number; longitude: number } | null = null
  nearestStopToUser: Stop | null = null
  distanceToNearestStop: number | null = null
  walkingTimeToNearestStop: number | null = null
  
  // Bus tracking - distance from bus to USER'S nearest stop
  busDistancesToUserNearestStop: { [busId: number]: number } = {}
  busPositions: { [busId: number]: { latitude: number; longitude: number; timestamp: number } } = {}
  
  locationLoading = false
  showLocationInfo = false
  busPositionsLoading = false

  constructor(
    private itineraryService: ItineraryService,
    private stopService: StopService,
    private busPositionService: BusPositionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadAllStops()
  }

  // Data loading methods
  loadAllStops(): void {
    this.stopService.getAllStops().subscribe({
      next: (stops) => {
        this.allStops = stops
        console.log("Loaded", stops.length, "stops")
      },
      error: (error) => {
        console.error("Error loading stops:", error)
        this.snackBar.open("Error loading stops", "Close", { duration: 3000 })
      },
    })
  }

  // STEP 1: User selects destination stop
  onSearchInput(): void {
    if (this.searchQuery.length > 1) {
      this.filteredSuggestions = this.allStops
        .filter((stop) => 
          stop.stopName?.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
        .slice(0, 8)
      this.showSuggestions = true
    } else {
      this.showSuggestions = false
      this.filteredSuggestions = []
    }
  }

  selectDestinationStop(stop: Stop): void {
    this.selectedDestinationStop = stop
    this.searchQuery = stop.stopName || "Unknown Stop"
    this.showSuggestions = false
    this.filteredSuggestions = []
    
    // Reset previous selections
    this.selectedItinerary = null
    this.resetLocationData()
    
    this.snackBar.open(`Selected "${stop.stopName}" as destination`, "Close", { duration: 2000 })
    
    // Load itineraries that pass by this stop
    this.loadItinerariesForDestination(stop)
  }

  // STEP 2: Load itineraries that contain the selected destination stop
  private loadItinerariesForDestination(destinationStop: Stop): void {
    this.loading = true
    
    // Use your backend service to get itineraries by stop
    this.itineraryService.getItinerariesByStop(destinationStop.stopName || "").subscribe({
      next: (itineraries) => {
        this.itineraries = itineraries
        this.loading = false
        
        if (itineraries.length === 0) {
          this.snackBar.open(`No routes found passing through "${destinationStop.stopName}"`, "Close", { duration: 3000 })
        } else {
          console.log(`Found ${itineraries.length} itineraries passing through ${destinationStop.stopName}`)
          this.snackBar.open(`Found ${itineraries.length} routes to your destination`, "Close", { duration: 2000 })
        }
      },
      error: (error) => {
        console.error("Error loading itineraries for destination:", error)
        this.snackBar.open("Error loading routes for your destination", "Close", { duration: 3000 })
        this.loading = false
      },
    })
  }

  // STEP 3: User selects an itinerary
  selectItinerary(itinerary: Itinerary): void {
    this.selectedItinerary = itinerary
    this.snackBar.open(`Selected route: ${itinerary.itineraryName}`, "Close", { duration: 2000 })
    
    console.log("Selected itinerary:", itinerary)
    
    // If user already has location, calculate distances
    if (this.userLocation) {
      this.findNearestStopToUserOnSelectedRoute()
      this.calculateBusDistances()
    }
  }

  // STEP 4: Get user location
  getCurrentLocation(): void {
    if (!this.selectedDestinationStop) {
      this.snackBar.open("Please select your destination stop first", "Close", { duration: 3000 })
      return
    }

    if (!navigator.geolocation) {
      this.snackBar.open("Geolocation is not supported by this browser", "Close", { duration: 3000 })
      return
    }

    this.locationLoading = true
    this.showLocationInfo = false

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        
        console.log("User location:", this.userLocation.latitude, this.userLocation.longitude)
        this.snackBar.open("Location obtained successfully!", "Close", { duration: 2000 })
        
        // Find nearest stop to user on all available routes
        this.findNearestStopToUserOnAvailableRoutes()
        
        // If user has selected an itinerary, calculate bus distances
        if (this.selectedItinerary) {
          this.calculateBusDistances()
        }
        
        this.locationLoading = false
        this.showLocationInfo = true
      },
      (error) => {
        console.error("Error getting location:", error)
        let errorMessage = "Unable to get your location. "
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please enable location permissions."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage += "Location request timed out."
            break
          default:
            errorMessage += "An unknown error occurred."
            break
        }
        
        this.snackBar.open(errorMessage, "Close", { duration: 5000 })
        this.locationLoading = false
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 minutes
      }
    )
  }

  // Find nearest stop to user from all available itinerary stops
  private findNearestStopToUserOnAvailableRoutes(): void {
    if (!this.userLocation || this.itineraries.length === 0) {
      return
    }

    const userLatLng = L.latLng(this.userLocation.latitude, this.userLocation.longitude)
    
    // Collect all unique stops from available itineraries
    const availableStops = new Map<number, Stop>()
    
    this.itineraries.forEach((itinerary) => {
      if (itinerary.stops && itinerary.stops.length > 0) {
        itinerary.stops.forEach((stop) => {
          if (stop.idStop && stop.latitude != null && stop.longitude != null) {
            availableStops.set(stop.idStop, stop)
          }
        })
      }
    })

    if (availableStops.size === 0) {
      console.warn("No stops with valid coordinates found in available itineraries")
      return
    }

    // Find nearest stop
    let nearestDistance = Infinity
    let nearestStop: Stop | null = null


    availableStops.forEach((stop) => {
      try {
        const stopLatLng = L.latLng(stop.latitude!, stop.longitude!)
        const distance = userLatLng.distanceTo(stopLatLng) // Distance in meters
        
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestStop = stop
        }
      } catch (error) {
        console.error(`Error calculating distance to stop ${stop.stopName}:`, error)
      }
    })

    this.nearestStopToUser = nearestStop
    this.distanceToNearestStop = nearestDistance < Infinity ? nearestDistance : null
    
    // Calculate walking time
    if (this.distanceToNearestStop) {
      const walkingSpeedMPS = 1.39 // 5 km/h
      this.walkingTimeToNearestStop = Math.round(this.distanceToNearestStop / walkingSpeedMPS / 60)
    }

    //console.log(`Nearest stop to user: ${nearestStop?.stopName || 'Unknown'} (${this.formatDistance(nearestDistance)})`)

//     if (nearestStop !== null) {
//   console.log(`Nearest stop to user: ${nearestStop.stopName || 'Unknown'} (${this.formatDistance(nearestDistance)})`)
// } else {
//   console.log('No nearest stop found')
// }

console.log(`Nearest stop to user: ${(nearestStop as Stop | null)?.stopName || 'Unknown'} (${this.formatDistance(nearestDistance)})`)

  }

  // Find nearest stop to user on selected route only
  private findNearestStopToUserOnSelectedRoute(): void {
    if (!this.userLocation || !this.selectedItinerary) {
      return
    }

    const userLatLng = L.latLng(this.userLocation.latitude, this.userLocation.longitude)
    
    if (!this.selectedItinerary.stops || this.selectedItinerary.stops.length === 0) {
      return
    }

    let nearestDistance = Infinity
    let nearestStop: Stop | null = null

    this.selectedItinerary.stops.forEach((stop) => {
      if (stop.latitude != null && stop.longitude != null) {
        try {
          const stopLatLng = L.latLng(stop.latitude, stop.longitude)
          const distance = userLatLng.distanceTo(stopLatLng)
          
          if (distance < nearestDistance) {
            nearestDistance = distance
            nearestStop = stop
          }
        } catch (error) {
          console.error(`Error calculating distance to stop ${stop.stopName}:`, error)
        }
      }
    })

    this.nearestStopToUser = nearestStop
    this.distanceToNearestStop = nearestDistance < Infinity ? nearestDistance : null
    
    if (this.distanceToNearestStop) {
      const walkingSpeedMPS = 1.39
      this.walkingTimeToNearestStop = Math.round(this.distanceToNearestStop / walkingSpeedMPS / 60)
    }
  }

  // Calculate distances from buses to USER'S nearest stop
  private calculateBusDistances(): void {
    if (!this.selectedItinerary || !this.selectedItinerary.buses || !this.nearestStopToUser) {
      console.warn("Cannot calculate bus distances: missing selected itinerary, buses, or user's nearest stop")
      return
    }

    // Reset bus data
    this.busDistancesToUserNearestStop = {}
    this.busPositions = {}
    this.busPositionsLoading = true

    console.log(`Calculating distances for ${this.selectedItinerary.buses.length} buses to user's nearest stop: ${this.nearestStopToUser.stopName}`)

    let completedRequests = 0
    const totalBuses = this.selectedItinerary.buses.length

    // For each bus in selected itinerary
    this.selectedItinerary.buses.forEach(bus => {
      if (bus.idBus) {
        this.busPositionService.getLatestLocation(bus.idBus).subscribe({
          next: (busPosition: BusPosition) => {
            completedRequests++
            
            if (busPosition && busPosition.latitude != null && busPosition.longitude != null) {
              // Store bus position with timestamp
              this.busPositions[bus.idBus!] = {
                latitude: busPosition.latitude,
                longitude: busPosition.longitude,
                timestamp: busPosition.time || Date.now()
              }

              // Calculate distance from bus to USER'S nearest stop
              const distanceToUserStop = this.calculateBusDistanceToUserNearestStop(bus.idBus!, busPosition)
              
              if (distanceToUserStop !== null) {
                this.busDistancesToUserNearestStop[bus.idBus!] = distanceToUserStop
              }

              console.log(`Bus ${bus.idBus} (${bus.matricule}) - Position: [${busPosition.latitude}, ${busPosition.longitude}], Distance to user's nearest stop (${this.nearestStopToUser?.stopName}): ${distanceToUserStop ? this.formatDistance(distanceToUserStop) : 'N/A'}`)
            } else {
              console.warn(`No valid position found for bus ${bus.idBus} (${bus.matricule})`)
            }

            // Check if all requests completed
            if (completedRequests === totalBuses) {
              this.busPositionsLoading = false
            }
          },
          error: (error) => {
            console.error(`Error getting latest position for bus ${bus.idBus} (${bus.matricule}):`, error)
            completedRequests++
            
            // Check if all requests completed (including failed ones)
            if (completedRequests === totalBuses) {
              this.busPositionsLoading = false
            }
          }
        })
      } else {
        completedRequests++
        if (completedRequests === totalBuses) {
          this.busPositionsLoading = false
        }
      }
    })
  }

  // Calculate distance from a specific bus to USER'S nearest stop
  private calculateBusDistanceToUserNearestStop(busId: number, busPosition: BusPosition): number | null {
    if (!busPosition.latitude || !busPosition.longitude || !this.nearestStopToUser) {
      return null
    }

    if (!this.nearestStopToUser.latitude || !this.nearestStopToUser.longitude) {
      console.warn(`User's nearest stop ${this.nearestStopToUser.stopName} has no valid coordinates`)
      return null
    }

    try {
      const busLatLng = L.latLng(busPosition.latitude, busPosition.longitude)
      const userNearestStopLatLng = L.latLng(this.nearestStopToUser.latitude, this.nearestStopToUser.longitude)
      
      // Calculate distance from bus to USER'S nearest stop
      const distance = busLatLng.distanceTo(userNearestStopLatLng) // Distance in meters
      
      console.log(`Bus ${busId} distance to user's nearest stop (${this.nearestStopToUser.stopName}): ${this.formatDistance(distance)}`)
      return distance
      
    } catch (error) {
      console.error(`Error calculating distance from bus ${busId} to user's nearest stop:`, error)
      return null
    }
  }

  // Helper methods
  formatDistance(distance: number): string {
    if (distance < 1000) {
      return `${Math.round(distance)}m`
    } else {
      return `${(distance / 1000).toFixed(1)}km`
    }
  }

  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
  }

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  getTimeSinceLastUpdate(timestamp: number): string {
    const now = Date.now()
    const diffMinutes = Math.floor((now - timestamp) / (1000 * 60))
    
    if (diffMinutes < 1) return "Just now"
    if (diffMinutes === 1) return "1 min ago"
    if (diffMinutes < 60) return `${diffMinutes} min ago`
    
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours === 1) return "1 hour ago"
    return `${diffHours} hours ago`
  }

  // Get bus distance to USER'S nearest stop
  getBusDistance(busId: number): number | null {
    return this.busDistancesToUserNearestStop[busId] || null
  }

  // Get bus position with timestamp
  getBusPosition(busId: number): { latitude: number; longitude: number; timestamp: number } | null {
    return this.busPositions[busId] || null
  }

  // Get bus details from selected itinerary
  getBusDetails(busId: number): Bus | null {
    if (!this.selectedItinerary || !this.selectedItinerary.buses) return null
    return this.selectedItinerary.buses.find(bus => bus.idBus === busId) || null
  }

  // Check if bus has position data
  hasBusPositionData(busId: number): boolean {
    return !!(this.busPositions[busId] && this.busDistancesToUserNearestStop[busId] != null)
  }

  // Get ETA for bus to reach USER'S nearest stop
  getBusETA(busId: number): string | null {
    const distance = this.getBusDistance(busId)
    if (!distance) return null

    const busSpeedMPS = 5.56 // 20 km/h
    const timeMinutes = Math.round(distance / busSpeedMPS / 60)
    return this.formatTime(timeMinutes)
  }

  // UI helper methods
  viewRouteDetails(itinerary: Itinerary): void {
    const dialogRef = this.dialog.open(RouteDetailsComponent, {
      width: "90%",
      maxWidth: "600px",
      data: { itinerary },
    })
  }

  clearSearch(): void {
    this.searchQuery = ""
    this.showSuggestions = false
    this.filteredSuggestions = []
    this.selectedDestinationStop = null
    this.selectedItinerary = null
    this.itineraries = []
    this.resetLocationData()
  }

  private resetLocationData(): void {
    this.nearestStopToUser = null
    this.distanceToNearestStop = null
    this.walkingTimeToNearestStop = null
    this.busDistancesToUserNearestStop = {}
    this.busPositions = {}
    this.showLocationInfo = false
    this.busPositionsLoading = false
  }

  clearLocationData(): void {
    this.userLocation = null
    this.resetLocationData()
    this.snackBar.open("Location data cleared", "Close", { duration: 2000 })
  }

  // Get workflow status for UI
  get workflowStep(): number {
    if (!this.selectedDestinationStop) return 1
    if (!this.selectedItinerary) return 2
    if (!this.userLocation) return 3
    return 4
  }

  get canGetLocation(): boolean {
    return !!this.selectedDestinationStop
  }

  get canShowBusInfo(): boolean {
    return !!(this.selectedItinerary && this.userLocation)
  }

  // Get buses sorted by distance to user's nearest stop
  getBusesSortedByDistance(): Bus[] {
    if (!this.selectedItinerary || !this.selectedItinerary.buses) {
      return []
    }

    return this.selectedItinerary.buses
      .filter(bus => this.hasBusPositionData(bus.idBus))
      .sort((a, b) => {
        const distanceA = this.getBusDistance(a.idBus) || Infinity
        const distanceB = this.getBusDistance(b.idBus) || Infinity
        return distanceA - distanceB
      })
  }

  // Get all buses with status
  getAllBusesWithStatus(): Array<Bus & { hasData: boolean; status: string }> {
    if (!this.selectedItinerary || !this.selectedItinerary.buses) {
      return []
    }

    return this.selectedItinerary.buses.map(bus => ({
      ...bus,
      hasData: this.hasBusPositionData(bus.idBus),
      status: this.hasBusPositionData(bus.idBus) ? 'Active' : 'No Data'
    }))
  }

  // Refresh bus positions manually
  refreshBusPositions(): void {
    if (this.selectedItinerary && this.nearestStopToUser) {
      this.calculateBusDistances()
      this.snackBar.open("Refreshing bus positions...", "Close", { duration: 2000 })
    } else {
      this.snackBar.open("Please select a route and get your location first", "Close", { duration: 3000 })
    }
  }

  // Get itinerary display name
  getItineraryDisplayName(itinerary: Itinerary): string {
    return itinerary.itineraryName || `Route ${itinerary.idItinerary || 'Unknown'}`
  }

  // Get stop display name
  getStopDisplayName(stop: Stop): string {
    return stop.stopName || `Stop ${stop.idStop || 'Unknown'}`
  }

  // Get bus display name
  getBusDisplayName(bus: Bus): string {
    return bus.matricule || `Bus ${bus.idBus}`
  }

  // Check if position data is fresh (less than 10 minutes old)
  isPositionDataFresh(busId: number): boolean {
    const position = this.getBusPosition(busId)
    if (!position) return false
    
    const tenMinutesAgo = Date.now() - (10 * 60 * 1000)
    return position.timestamp > tenMinutesAgo
  }
}