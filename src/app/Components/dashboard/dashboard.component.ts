// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   imports: [],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css'
// })
// export class DashboardComponent {

// }







import { Component, type OnInit } from "@angular/core"
import { Router, RouterModule } from "@angular/router"
import { BusService } from "../../service/BusService/bus.service"
import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
import { Bus } from "../../entity/bus"
import { Itinerary } from "../../entity/itinerary"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { AdminHeaderComponent } from "../admin-header/admin-header.component"

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    AdminHeaderComponent
  ]
})
export class DashboardComponent implements OnInit {
  totalBuses = 0
  totalItineraries = 0
  totalStops = 0
  activeBuses = 0
  loading = true
  recentItineraries: Itinerary[] = []

  constructor(
    private busService: BusService,
    private itineraryService: ItineraryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData()
  }

  loadDashboardData(): void {
    this.loading = true
    let loadedItems = 0
    const totalItems = 2

    // Load buses
    this.busService.getAllBuses().subscribe({
      next: (buses: Bus[]) => {
        this.totalBuses = buses.length
        // Simulate active buses (in real app, check bus status)
        this.activeBuses = Math.floor(buses.length * 0.7)
        loadedItems++
        if (loadedItems === totalItems) this.loading = false
      },
      error: (error) => {
        console.error("Error loading buses:", error)
        loadedItems++
        if (loadedItems === totalItems) this.loading = false
      }
    })

    // Load itineraries
    this.itineraryService.getAllItineraries().subscribe({
      next: (itineraries: Itinerary[]) => {
        this.totalItineraries = itineraries.length
        
        // Get recent itineraries (last 5)
        this.recentItineraries = itineraries.slice(0, 5)
        
        // Calculate unique stops
        const allStops = new Set()
        itineraries.forEach((itinerary) => {
          if (itinerary.stops) {
            itinerary.stops.forEach((stop) => allStops.add(stop.idStop))
          }
        })
        this.totalStops = allStops.size
        
        loadedItems++
        if (loadedItems === totalItems) this.loading = false
      },
      error: (error) => {
        console.error("Error loading itineraries:", error)
        loadedItems++
        if (loadedItems === totalItems) this.loading = false
      }
    })
  }

  getItineraryDisplayName(itinerary: Itinerary): string {
    return itinerary.itineraryName || `Route ${itinerary.idItinerary || 'Unknown'}`
  }

  getStopDisplayName(stop: any): string {
    return stop?.stopName || 'Unknown'
  }

  navigateToRoute(itineraryId: number | undefined): void {
    if (itineraryId) {
      this.router.navigate(['/update-itinerary', itineraryId])
    }
  }
}