// import { Component, type OnInit } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { FormsModule } from "@angular/forms"
// import { MatCardModule } from "@angular/material/card"
// import { MatFormFieldModule } from "@angular/material/form-field"
// import { MatInputModule } from "@angular/material/input"
// import { MatButtonModule } from "@angular/material/button"
// import { MatIconModule } from "@angular/material/icon"
// import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
// import { MatChipsModule } from "@angular/material/chips"
// // import { MatDialogModule, type MatDialog } from "@angular/material/dialog"
// // import { type MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
// import { HttpClientModule } from "@angular/common/http"

// import { RouteDetailsComponent } from "../route-details/route-details.component"
// import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
// import { Itinerary } from "../../entity/itinerary"
// import { Stop } from "../../entity/stop"
// import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
// import { StopService } from "../../service/StopService/stop.service"
// import { MatDialog, MatDialogModule } from "@angular/material/dialog"
// //import { MatDialogModule } from "@angular/material/dialog"

// @Component({
//   selector: "app-user-itinerary-browser",
//   templateUrl: "./user-itinerary-browser.component.html",
//   styleUrls: ["./user-itinerary-browser.component.css"],
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatIconModule,
//     MatProgressSpinnerModule,
//     MatChipsModule,
//     MatDialogModule,
//     MatSnackBarModule,
//     HttpClientModule,
//   ],
// })
// export class UserItineraryBrowserComponent implements OnInit {
//   searchQuery = ""
//   searchType: "departure" | "destination" | "stop" = "departure"
//   itineraries: Itinerary[] = []
//   allStops: Stop[] = []
//   loading = false
//   showSuggestions = false
//   filteredSuggestions: Stop[] = []

//   constructor(
//     private itineraryService: ItineraryService,
//     private stopService: StopService,
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//   ) {}

//   ngOnInit(): void {
//     this.loadAllStops()
//     this.loadAllItineraries()
//   }

//   loadAllStops(): void {
//     this.stopService.getAllStops().subscribe({
//       next: (stops) => {
//         this.allStops = stops
//       },
//       error: (error) => {
//         console.error("Error loading stops:", error)
//       },
//     })
//   }

//   loadAllItineraries(): void {
//     this.loading = true
//     this.itineraryService.getAllItineraries().subscribe({
//       next: (itineraries) => {
//         this.itineraries = itineraries
//         this.loading = false
//       },
//       error: (error) => {
//         console.error("Error loading itineraries:", error)
//         this.snackBar.open("Error loading routes", "Close", { duration: 3000 })
//         this.loading = false
//       },
//     })
//   }

//   onSearchInput(): void {
//     if (this.searchQuery.length > 1) {
//       this.filteredSuggestions = this.allStops
//         .filter((stop) => stop.stopName.toLowerCase().includes(this.searchQuery.toLowerCase()))
//         .slice(0, 5)
//       this.showSuggestions = true
//     } else {
//       this.showSuggestions = false
//     }
//   }

//   selectSuggestion(stop: Stop): void {
//     this.searchQuery = stop.stopName
//     this.showSuggestions = false
//     this.searchRoutes()
//   }

//   searchRoutes(): void {
//     if (!this.searchQuery.trim()) {
//       this.loadAllItineraries()
//       return
//     }

//     this.loading = true
//     let searchObservable

//     switch (this.searchType) {
//       case "departure":
//         searchObservable = this.itineraryService.getItinerariesByDeparture(this.searchQuery)
//         break
//       case "destination":
//         searchObservable = this.itineraryService.getItinerariesByDestination(this.searchQuery)
//         break
//       case "stop":
//         searchObservable = this.itineraryService.getItinerariesByStop(this.searchQuery)
//         break
//     }

//     searchObservable.subscribe({
//       next: (itineraries) => {
//         this.itineraries = itineraries
//         this.loading = false
//         if (itineraries.length === 0) {
//           this.snackBar.open("No routes found for your search", "Close", { duration: 3000 })
//         }
//       },
//       error: (error) => {
//         console.error("Error searching routes:", error)
//         this.snackBar.open("Error searching routes", "Close", { duration: 3000 })
//         this.loading = false
//       },
//     })
//   }

//   setSearchType(type: "departure" | "destination" | "stop"): void {
//     this.searchType = type
//     this.searchQuery = ""
//     this.showSuggestions = false
//   }

//   viewRouteDetails(itinerary: Itinerary): void {
//     const dialogRef = this.dialog.open(RouteDetailsComponent, {
//       width: "90%",
//       maxWidth: "600px",
//       data: { itinerary },
//     })
//   }

//   getSearchTypeLabel(): string {
//     switch (this.searchType) {
//       case "departure":
//         return "From"
//       case "destination":
//         return "To"
//       case "stop":
//         return "Via"
//       default:
//         return "Search"
//     }
//   }

//   clearSearch(): void {
//     this.searchQuery = ""
//     this.showSuggestions = false
//     this.loadAllItineraries()
//   }
// }




import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatChipsModule } from "@angular/material/chips"
import { HttpClientModule } from "@angular/common/http"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"

import { RouteDetailsComponent } from "../route-details/route-details.component"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { Itinerary } from "../../entity/itinerary"
import { Stop } from "../../entity/stop"
import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
import { StopService } from "../../service/StopService/stop.service"
import { BusPositionService } from "../../service/BusPositionService/bus-position.service"



@Component({
  selector: "app-user-itinerary-browser",
  templateUrl: "./user-itinerary-browser.component.html",
  styleUrls: ["./user-itinerary-browser.component.css"],
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
    MatDialogModule,
    MatSnackBarModule,
    HttpClientModule,
  ],
})
export class UserItineraryBrowserComponent implements OnInit {
  searchQuery = ""
  searchType: "departure" | "destination" | "stop" = "departure"
  itineraries: Itinerary[] = []
  allStops: Stop[] = []
  loading = false
  showSuggestions = false
  filteredSuggestions: Stop[] = []

  selectedDestination: Stop | null = null
  userLocation: { latitude: number; longitude: number } | null = null
  nearestStop: Stop | null = null
  travelTime: number | null = null
  busDistances: { [busId: number]: number } = {}
  locationLoading = false
  showLocationInfo = false

  constructor(
    private itineraryService: ItineraryService,
    private stopService: StopService,
    private busPositionService: BusPositionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadAllStops()
    this.loadAllItineraries()
  }

  loadAllStops(): void {
    this.stopService.getAllStops().subscribe({
      next: (stops) => {
        this.allStops = stops
      },
      error: (error) => {
        console.error("Error loading stops:", error)
      },
    })
  }

  loadAllItineraries(): void {
    this.loading = true
    this.itineraryService.getAllItineraries().subscribe({
      next: (itineraries) => {
        this.itineraries = itineraries
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading itineraries:", error)
        this.snackBar.open("Error loading routes", "Close", { duration: 3000 })
        this.loading = false
      },
    })
  }

  onSearchInput(): void {
    if (this.searchQuery.length > 1) {
      this.filteredSuggestions = this.allStops
        .filter((stop) => stop.stopName.toLowerCase().includes(this.searchQuery.toLowerCase()))
        .slice(0, 5)
      this.showSuggestions = true
    } else {
      this.showSuggestions = false
    }
  }

  selectSuggestion(stop: Stop): void {
    this.searchQuery = stop.stopName
    this.showSuggestions = false
    if (this.searchType === "destination") {
      this.selectedDestination = stop
    }
    this.searchRoutes()
  }

  searchRoutes(): void {
    if (!this.searchQuery.trim()) {
      this.loadAllItineraries()
      return
    }

    this.loading = true
    let searchObservable

    switch (this.searchType) {
      case "departure":
        searchObservable = this.itineraryService.getItinerariesByDeparture(this.searchQuery)
        break
      case "destination":
        searchObservable = this.itineraryService.getItinerariesByDestination(this.searchQuery)
        break
      case "stop":
        searchObservable = this.itineraryService.getItinerariesByStop(this.searchQuery)
        break
    }

    searchObservable.subscribe({
      next: (itineraries) => {
        this.itineraries = itineraries
        this.loading = false
        if (itineraries.length === 0) {
          this.snackBar.open("No routes found for your search", "Close", { duration: 3000 })
        }
      },
      error: (error) => {
        console.error("Error searching routes:", error)
        this.snackBar.open("Error searching routes", "Close", { duration: 3000 })
        this.loading = false
      },
    })
  }

  setSearchType(type: "departure" | "destination" | "stop"): void {
    this.searchType = type
    this.searchQuery = ""
    this.showSuggestions = false
  }

  viewRouteDetails(itinerary: Itinerary): void {
    const dialogRef = this.dialog.open(RouteDetailsComponent, {
      width: "90%",
      maxWidth: "600px",
      data: { itinerary },
    })
  }

  getSearchTypeLabel(): string {
    switch (this.searchType) {
      case "departure":
        return "From"
      case "destination":
        return "To"
      case "stop":
        return "Via"
      default:
        return "Search"
    }
  }

  clearSearch(): void {
    this.searchQuery = ""
    this.showSuggestions = false
    this.loadAllItineraries()
  }

  getCurrentLocation(): void {
    if (!this.selectedDestination) {
      this.snackBar.open("Please select a destination first", "Close", { duration: 3000 })
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
        console.log("latitude : " + this.userLocation.latitude + "longitude : " + this.userLocation.longitude)
        this.findNearestStop()
      },
      (error) => {
        console.error("Error getting location:", error)
        this.snackBar.open("Unable to get your location. Please enable location services.", "Close", { duration: 3000 })
        this.locationLoading = false
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    )
  }

  selectDestinationStop(stop: Stop): void {
    this.selectedDestination = stop
    this.searchType = "destination"
    this.searchQuery = stop.stopName

    // Reset location info when selecting new destination
    this.showLocationInfo = false
    this.nearestStop = null
    this.travelTime = null
    this.busDistances = {}

    this.snackBar.open(`Selected "${stop.stopName}" as destination`, "Close", { duration: 2000 })
  }

  private findNearestStop(): void {
    if (!this.userLocation || !this.selectedDestination) return

    this.busPositionService
      .getNearestStop(this.userLocation.latitude, this.userLocation.longitude, this.selectedDestination.idStop!)
      .subscribe({
        next: (nearestStop) => {
          this.nearestStop = nearestStop
          this.getTravelTimeToStop()
        },
        error: (error) => {
          console.error("Error finding nearest stop:", error)
          this.snackBar.open("Error finding nearest stop", "Close", { duration: 3000 })
          this.locationLoading = false
        },
      })
  }

  private getTravelTimeToStop(): void {
    if (!this.userLocation || !this.selectedDestination) return

    this.busPositionService
      .getTravelTime(this.userLocation.latitude, this.userLocation.longitude, this.selectedDestination.idStop!)
      .subscribe({
        next: (travelTime) => {
          this.travelTime = travelTime
          this.getBusDistances()
        },
        error: (error) => {
          console.error("Error getting travel time:", error)
          this.snackBar.open("Error calculating travel time", "Close", { duration: 3000 })
          this.locationLoading = false
        },
      })
  }

  private getBusDistances(): void {
    if (!this.nearestStop || !this.itineraries.length) {
      this.locationLoading = false
      this.showLocationInfo = true
      return
    }

    const busIds: number[] = []
    this.itineraries.forEach((itinerary) => {
      if (itinerary.buses) {
        itinerary.buses.forEach((bus) => {
          if (bus.idBus && !busIds.includes(bus.idBus)) {
            busIds.push(bus.idBus)
          }
        })
      }
    })

    if (busIds.length === 0) {
      this.locationLoading = false
      this.showLocationInfo = true
      return
    }

    let completedRequests = 0
    busIds.forEach((busId) => {
      this.busPositionService.getDistanceBusToStop(busId, this.nearestStop!.idStop!).subscribe({
        next: (distance) => {
          this.busDistances[busId] = distance
          completedRequests++
          if (completedRequests === busIds.length) {
            this.locationLoading = false
            this.showLocationInfo = true
          }
        },
        error: (error) => {
          console.error(`Error getting distance for bus ${busId}:`, error)
          completedRequests++
          if (completedRequests === busIds.length) {
            this.locationLoading = false
            this.showLocationInfo = true
          }
        },
      })
    })
  }

  getBusDistance(busId: number): number | null {
    return this.busDistances[busId] || null
  }

  formatDistance(distance: number): string {
    if (distance < 1000) {
      return `${Math.round(distance)}m`
    } else {
      return `${(distance / 1000).toFixed(1)}km`
    }
  }
}
