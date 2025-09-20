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

import { RouteDetailsComponent } from "../route-details/route-details.component"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { Itinerary } from "../../entity/itinerary"
import { Stop } from "../../entity/stop"
import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
import { StopService } from "../../service/StopService/stop.service"


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

  constructor(
    private itineraryService: ItineraryService,
    private stopService: StopService,
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
}
