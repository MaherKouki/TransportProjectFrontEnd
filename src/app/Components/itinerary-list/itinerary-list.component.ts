// import { Component, OnInit } from "@angular/core"
// import { Itinerary } from "../../entity/itinerary"
// import { Bus } from "../../entity/bus"
// import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
// import { BusService } from "../../service/BusService/bus.service"
// import { MatSnackBar } from "@angular/material/snack-bar"
// import { CommonModule, NgFor, NgIf } from "@angular/common"
// import { FormsModule, ReactiveFormsModule } from "@angular/forms"
// import { MatCardModule } from "@angular/material/card"
// import { MatTableModule } from "@angular/material/table"
// import { MatFormFieldModule } from "@angular/material/form-field"
// import { MatInputModule } from "@angular/material/input"
// import { MatButtonModule } from "@angular/material/button"
// import { MatIconModule } from "@angular/material/icon"
// import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
// import { MatOption } from "@angular/material/autocomplete"
// import { MatChip, MatChipsModule } from "@angular/material/chips"
// import { MatSelectModule } from "@angular/material/select"
// import { RouterModule } from "@angular/router"


// @Component({
//   selector: "app-itinerary-list",
//   templateUrl: "./itinerary-list.component.html",
//   styleUrls: ["./itinerary-list.component.css"],

//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,       // ✅ needed for [formGroup], formControlName
//     MatCardModule,
//     MatTableModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatIconModule,
//     MatProgressSpinnerModule,
//     MatOption,
//     FormsModule,
//     MatChipsModule,
//     MatSelectModule,
//     RouterModule,
//     NgFor,
//     NgIf,
//     CommonModule,
//         FormsModule,    // 👈 must be here for ngModel
//     MatInputModule,
//   ]
// })

// export class ItineraryListComponent implements OnInit {
//   itineraries: Itinerary[] = []
//   buses: Bus[] = []
//   loading = false
//   searchTerm = ""

//   constructor(
//     private itineraryService: ItineraryService,
//     private busService: BusService,
//     private snackBar: MatSnackBar,
//   ) {}

//   ngOnInit(): void {
//     this.loadItineraries()
//     this.loadBuses()
//   }

//   loadItineraries(): void {
//     this.loading = true
//     this.itineraryService.getAllItineraries().subscribe({
//       next: (itineraries) => {
//         this.itineraries = itineraries
//         this.loading = false
//       },
//       error: (error) => {
//         console.error("Error loading itineraries:", error)
//         this.snackBar.open("Error loading itineraries", "Close", { duration: 3000 })
//         this.loading = false
//       },
//     })
//   }

//   loadBuses(): void {
//     this.busService.getAllBuses().subscribe({
//       next: (buses) => {
//         this.buses = buses
//       },
//       error: (error) => {
//         console.error("Error loading buses:", error)
//       },
//     })
//   }

//   get filteredItineraries(): Itinerary[] {
//     if (!this.searchTerm) {
//       return this.itineraries
//     }

//     return this.itineraries.filter(
//       (itinerary) =>
//         itinerary.itineraryName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         itinerary.departure?.stopName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         itinerary.destination?.stopName.toLowerCase().includes(this.searchTerm.toLowerCase()),
//     )
//   }

//   assignBusToItinerary(itineraryId: number, busId: number): void {
//     this.busService.affectItineraryToBus(busId, itineraryId).subscribe({
//       next: (response) => {
//         this.snackBar.open("Bus assigned successfully", "Close", { duration: 3000 })
//         this.loadItineraries() // Reload to show updated assignments
//       },
//       error: (error) => {
//         console.error("Error assigning bus:", error)
//         this.snackBar.open("Error assigning bus to itinerary", "Close", { duration: 3000 })
//       },
//     })
//   }

//   searchByDeparture(departure: string): void {
//     if (departure.trim()) {
//       this.itineraryService.getItinerariesByDeparture(departure).subscribe({
//         next: (itineraries) => {
//           this.itineraries = itineraries
//         },
//         error: (error) => {
//           console.error("Error searching by departure:", error)
//           this.snackBar.open("No itineraries found for this departure", "Close", { duration: 3000 })
//         },
//       })
//     } else {
//       this.loadItineraries()
//     }
//   }

//   searchByDestination(destination: string): void {
//     if (destination.trim()) {
//       this.itineraryService.getItinerariesByDestination(destination).subscribe({
//         next: (itineraries) => {
//           this.itineraries = itineraries
//         },
//         error: (error) => {
//           console.error("Error searching by destination:", error)
//           this.snackBar.open("No itineraries found for this destination", "Close", { duration: 3000 })
//         },
//       })
//     } else {
//       this.loadItineraries()
//     }
//   }

//   getAvailableBuses(itinerary: Itinerary): Bus[] {
//     // Return buses that are not already assigned to this itinerary
//     const assignedBusIds = itinerary.buses?.map((bus) => bus.idBus) || []
//     return this.buses.filter((bus) => !assignedBusIds.includes(bus.idBus))
//   }
// }






















