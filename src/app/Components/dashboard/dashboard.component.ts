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
import { BusService } from "../../service/BusService/bus.service"
import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
import { Bus } from "../../entity/bus"
import { Itinerary } from "../../entity/itinerary"
import { CommonModule, NgFor, NgIf } from "@angular/common"
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
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
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
    FormsModule,
        NgFor,
    NgIf,
 
  ]
})
export class DashboardComponent implements OnInit {
  totalBuses = 0
  totalItineraries = 0
  totalStops = 0
  loading = true

  constructor(
    private busService: BusService,
    private itineraryService: ItineraryService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData()
  }

  loadDashboardData(): void {
    this.loading = true

    // Load buses count
    this.busService.getAllBuses().subscribe({
      next: (buses: Bus[]) => {
        this.totalBuses = buses.length
        this.checkLoadingComplete()
      },
      error: (error) => {
        console.error("Error loading buses:", error)
        this.checkLoadingComplete()
      },
    })

    // Load itineraries count
    this.itineraryService.getAllItineraries().subscribe({
      next: (itineraries: Itinerary[]) => {
        this.totalItineraries = itineraries.length
        // Calculate total stops from all itineraries
        const allStops = new Set()
        itineraries.forEach((itinerary) => {
          if (itinerary.stops) {
            itinerary.stops.forEach((stop) => allStops.add(stop.idStop))
          }
        })
        this.totalStops = allStops.size
        this.checkLoadingComplete()
      },
      error: (error) => {
        console.error("Error loading itineraries:", error)
        this.checkLoadingComplete()
      },
    })
  }

  private checkLoadingComplete(): void {
    // Simple check - in a real app you'd want more sophisticated loading state management
    setTimeout(() => {
      this.loading = false
    }, 500)
  }
}
