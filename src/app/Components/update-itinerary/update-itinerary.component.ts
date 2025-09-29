// import { Component, OnInit } from "@angular/core"
// import { ActivatedRoute, Router } from "@angular/router"
// import { FormBuilder, FormGroup, Validators } from "@angular/forms"
// import { MatSnackBar } from "@angular/material/snack-bar"
// import { CommonModule } from "@angular/common"
// import { ReactiveFormsModule } from "@angular/forms"
// import { MatCardModule } from "@angular/material/card"
// import { MatFormFieldModule } from "@angular/material/form-field"
// import { MatInputModule } from "@angular/material/input"
// import { MatButtonModule } from "@angular/material/button"
// import { MatIconModule } from "@angular/material/icon"
// import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
// import { MatSelectModule } from "@angular/material/select"
// import { MatChipsModule } from "@angular/material/chips"
// import { MatAutocompleteModule } from "@angular/material/autocomplete"

// import { Itinerary } from "../../entity/itinerary"
// import { Stop } from "../../entity/stop"
// import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
// import { StopService } from "../../service/StopService/stop.service"

// @Component({
//   selector: "app-update-itinerary",
//   templateUrl: "./update-itinerary.component.html",
//   styleUrls: ["./update-itinerary.component.css"],
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatCardModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatIconModule,
//     MatProgressSpinnerModule,
//     MatSelectModule,
//     MatChipsModule,
//     MatAutocompleteModule
//   ]
// })
// export class UpdateItineraryComponent implements OnInit {
//   updateForm!: FormGroup
//   itineraryId!: number
//   currentItinerary: Itinerary | null = null
//   allStops: Stop[] = []
//   filteredDepartureStops: Stop[] = []
//   filteredDestinationStops: Stop[] = []
//   loading = false
//   saving = false

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//     private itineraryService: ItineraryService,
//     private stopService: StopService,
//     private snackBar: MatSnackBar
//   ) {
//     this.initForm()
//   }

//   ngOnInit(): void {
//     this.route.params.subscribe(params => {
//       this.itineraryId = +params['id']
//       if (this.itineraryId) {
//         this.loadItinerary()
//         this.loadStops()
//       }
//     })
//   }

//   initForm(): void {
//     this.updateForm = this.fb.group({
//       itineraryName: ['', [Validators.required, Validators.minLength(3)]],
//       startTime: [''],
//       departureStopName: ['', Validators.required],
//       destinationStopName: ['', Validators.required]
//     })
//   }

//   loadItinerary(): void {
//     this.loading = true
//     this.itineraryService.getItineraryById(this.itineraryId).subscribe({
//       next: (itinerary) => {
//         this.currentItinerary = itinerary
//         this.populateForm(itinerary)
//         this.loading = false
//       },
//       error: (error) => {
//         console.error("Error loading itinerary:", error)
//         this.snackBar.open("Error loading itinerary", "Close", { duration: 3000 })
//         this.loading = false
//       }
//     })
//   }

//   loadStops(): void {
//     this.stopService.getAllStops().subscribe({
//       next: (stops) => {
//         this.allStops = stops
//         this.filteredDepartureStops = stops
//         this.filteredDestinationStops = stops
//       },
//       error: (error) => {
//         console.error("Error loading stops:", error)
//       }
//     })
//   }

//   populateForm(itinerary: Itinerary): void {
//     this.updateForm.patchValue({
//       itineraryName: itinerary.itineraryName || '',
//       startTime: itinerary.startTime || '',
//       departureStopName: itinerary.departure?.stopName || '',
//       destinationStopName: itinerary.destination?.stopName || ''
//     })
//   }

//   onDepartureInput(): void {
//     const value = this.updateForm.get('departureStopName')?.value || ''
//     this.filteredDepartureStops = this.allStops.filter(stop => 
//       stop.stopName?.toLowerCase().includes(value.toLowerCase())
//     )
//   }

//   onDestinationInput(): void {
//     const value = this.updateForm.get('destinationStopName')?.value || ''
//     this.filteredDestinationStops = this.allStops.filter(stop => 
//       stop.stopName?.toLowerCase().includes(value.toLowerCase())
//     )
//   }

//   selectDepartureStop(stop: Stop): void {
//     this.updateForm.patchValue({ departureStopName: stop.stopName })
//     this.filteredDepartureStops = []
//   }

//   selectDestinationStop(stop: Stop): void {
//     this.updateForm.patchValue({ destinationStopName: stop.stopName })
//     this.filteredDestinationStops = []
//   }

//   onSubmit(): void {
//     if (this.updateForm.valid && this.currentItinerary) {
//       const formData = this.updateForm.value
      
//       // Find departure and destination stops
//       const departureStop = this.allStops.find(stop => 
//         stop.stopName === formData.departureStopName
//       )
//       const destinationStop = this.allStops.find(stop => 
//         stop.stopName === formData.destinationStopName
//       )

//       if (!departureStop || !destinationStop) {
//         this.snackBar.open("Please select valid departure and destination stops", "Close", { duration: 3000 })
//         return
//       }

//       const updatedItinerary: Itinerary = {
//         ...this.currentItinerary,
//         itineraryName: formData.itineraryName,
//         startTime: formData.startTime,
//         departure: departureStop,
//         destination: destinationStop
//       }

//       this.saving = true
//       this.itineraryService.updateItinerary(this.itineraryId, updatedItinerary).subscribe({
//         next: (response) => {
//           this.snackBar.open("Itinerary updated successfully!", "Close", { duration: 3000 })
//           this.saving = false
//           this.router.navigate(['/itineraries'])
//         },
//         error: (error) => {
//           console.error("Error updating itinerary:", error)
//           this.snackBar.open("Error updating itinerary", "Close", { duration: 3000 })
//           this.saving = false
//         }
//       })
//     } else {
//       this.markFormGroupTouched()
//     }
//   }

//   markFormGroupTouched(): void {
//     Object.keys(this.updateForm.controls).forEach(key => {
//       const control = this.updateForm.get(key)
//       control?.markAsTouched()
//     })
//   }

//   cancel(): void {
//     this.router.navigate(['/itineraries'])
//   }

//   getStopDisplayName(stop: Stop): string {
//     return stop.stopName || `Stop ${stop.idStop || 'Unknown'}`
//   }
// }



















import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MatSnackBar } from "@angular/material/snack-bar"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSelectModule } from "@angular/material/select"
import { MatChipsModule } from "@angular/material/chips"
import { MatAutocompleteModule } from "@angular/material/autocomplete"
import { MatDialogModule, MatDialog } from "@angular/material/dialog"

import { Itinerary } from "../../entity/itinerary"
import { Stop } from "../../entity/stop"
import { ItineraryService } from "../../service/ItineraryService/itinerary.service"
import { StopService } from "../../service/StopService/stop.service"

@Component({
  selector: "app-update-itinerary",
  templateUrl: "./update-itinerary.component.html",
  styleUrls: ["./update-itinerary.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule
  ]
})
export class UpdateItineraryComponent implements OnInit {
  updateForm!: FormGroup
  itineraryId!: number
  currentItinerary: Itinerary | null = null
  allStops: Stop[] = []
  filteredDepartureStops: Stop[] = []
  filteredDestinationStops: Stop[] = []
  loading = false
  saving = false

  // Stop editing variables
  editingStopId: number | null = null
  editingStop: Stop | null = null
  savingStopId: number | null = null

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private itineraryService: ItineraryService,
    private stopService: StopService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.initForm()
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.itineraryId = +params['id']
      if (this.itineraryId) {
        this.loadItinerary()
        this.loadStops()
      }
    })
  }

  initForm(): void {
    this.updateForm = this.fb.group({
      itineraryName: ['', [Validators.required, Validators.minLength(3)]],
      startTime: [''],
      departureStopName: ['', Validators.required],
      destinationStopName: ['', Validators.required]
    })
  }

  loadItinerary(): void {
    this.loading = true
    this.itineraryService.getItineraryById(this.itineraryId).subscribe({
      next: (itinerary) => {
        this.currentItinerary = itinerary
        this.populateForm(itinerary)
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading itinerary:", error)
        this.snackBar.open("Error loading itinerary", "Close", { duration: 3000 })
        this.loading = false
      }
    })
  }

  loadStops(): void {
    this.stopService.getAllStops().subscribe({
      next: (stops) => {
        this.allStops = stops
        this.filteredDepartureStops = stops
        this.filteredDestinationStops = stops
      },
      error: (error) => {
        console.error("Error loading stops:", error)
      }
    })
  }

  populateForm(itinerary: Itinerary): void {
    this.updateForm.patchValue({
      itineraryName: itinerary.itineraryName || '',
      startTime: itinerary.startTime || '',
      departureStopName: itinerary.departure?.stopName || '',
      destinationStopName: itinerary.destination?.stopName || ''
    })
  }

  onDepartureInput(): void {
    const value = this.updateForm.get('departureStopName')?.value || ''
    this.filteredDepartureStops = this.allStops.filter(stop => 
      stop.stopName?.toLowerCase().includes(value.toLowerCase())
    )
  }

  onDestinationInput(): void {
    const value = this.updateForm.get('destinationStopName')?.value || ''
    this.filteredDestinationStops = this.allStops.filter(stop => 
      stop.stopName?.toLowerCase().includes(value.toLowerCase())
    )
  }

  selectDepartureStop(stop: Stop): void {
    this.updateForm.patchValue({ departureStopName: stop.stopName })
    this.filteredDepartureStops = []
  }

  selectDestinationStop(stop: Stop): void {
    this.updateForm.patchValue({ destinationStopName: stop.stopName })
    this.filteredDestinationStops = []
  }

  // Stop editing methods
  startEditingStop(stop: Stop): void {
    this.editingStopId = stop.idStop!
    this.editingStop = { ...stop } // Create a copy for editing
  }

  // Get stops sorted by orderIndex
  getSortedStops(): Stop[] {
    if (!this.currentItinerary?.stops) return []
    
    return [...this.currentItinerary.stops].sort((a, b) => {
      const orderA = a.orderIndex || 0
      const orderB = b.orderIndex || 0
      return orderA - orderB
    })
  }

  cancelEditingStop(): void {
    this.editingStopId = null
    this.editingStop = null
  }

  saveStopChanges(): void {
    if (!this.editingStop || !this.editingStopId) return

    this.savingStopId = this.editingStopId
    
    this.stopService.updateStop(this.editingStopId, this.editingStop).subscribe({
      next: (updatedStop) => {
        // Update the stop in the current itinerary
        if (this.currentItinerary?.stops) {
          const stopIndex = this.currentItinerary.stops.findIndex(s => s.idStop === this.editingStopId)
          if (stopIndex !== -1) {
            this.currentItinerary.stops[stopIndex] = updatedStop
          }
        }
        
        this.snackBar.open("Stop updated successfully!", "Close", { duration: 3000 })
        this.editingStopId = null
        this.editingStop = null
        this.savingStopId = null
      },
      error: (error) => {
        console.error("Error updating stop:", error)
        this.snackBar.open("Error updating stop", "Close", { duration: 3000 })
        this.savingStopId = null
      }
    })
  }

  deleteStop(stop: Stop): void {
    if (!stop.idStop) return

    const confirmed = confirm(`Are you sure you want to delete "${stop.stopName}"? This action cannot be undone.`)
    
    if (confirmed) {
      this.stopService.deleteStop(stop.idStop).subscribe({
        next: () => {
          // Remove the stop from the current itinerary
          if (this.currentItinerary?.stops) {
            this.currentItinerary.stops = this.currentItinerary.stops.filter(s => s.idStop !== stop.idStop)
          }
          
          this.snackBar.open("Stop deleted successfully!", "Close", { duration: 3000 })
          
          // If we were editing this stop, cancel the editing
          if (this.editingStopId === stop.idStop) {
            this.cancelEditingStop()
          }
        },
        error: (error) => {
          console.error("Error deleting stop:", error)
          this.snackBar.open("Error deleting stop", "Close", { duration: 3000 })
        }
      })
    }
  }

  isEditing(stop: Stop): boolean {
    return this.editingStopId === stop.idStop
  }

  isSaving(stop: Stop): boolean {
    return this.savingStopId === stop.idStop
  }

  onSubmit(): void {
    if (this.updateForm.valid && this.currentItinerary) {
      const formData = this.updateForm.value
      
      // Find departure and destination stops
      const departureStop = this.allStops.find(stop => 
        stop.stopName === formData.departureStopName
      )
      const destinationStop = this.allStops.find(stop => 
        stop.stopName === formData.destinationStopName
      )

      if (!departureStop || !destinationStop) {
        this.snackBar.open("Please select valid departure and destination stops", "Close", { duration: 3000 })
        return
      }

      const updatedItinerary: Itinerary = {
        ...this.currentItinerary,
        itineraryName: formData.itineraryName,
        startTime: formData.startTime,
        departure: departureStop,
        destination: destinationStop
      }

      this.saving = true
      this.itineraryService.updateItinerary(this.itineraryId, updatedItinerary).subscribe({
        next: (response) => {
          this.snackBar.open("Itinerary updated successfully!", "Close", { duration: 3000 })
          this.saving = false
          this.router.navigate(['/itineraries'])
        },
        error: (error) => {
          console.error("Error updating itinerary:", error)
          this.snackBar.open("Error updating itinerary", "Close", { duration: 3000 })
          this.saving = false
        }
      })
    } else {
      this.markFormGroupTouched()
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.updateForm.controls).forEach(key => {
      const control = this.updateForm.get(key)
      control?.markAsTouched()
    })
  }

  cancel(): void {
    this.router.navigate(['/itineraries'])
  }

  // New method to navigate to add stops map
  addStopsToItinerary(): void {
    if (this.itineraryId) {
      this.router.navigate(['/addStopsMap', this.itineraryId])
    } else {
      this.snackBar.open("Please save the itinerary first before adding stops", "Close", { duration: 3000 })
    }
  }

  getStopDisplayName(stop: Stop): string {
    return stop.stopName || `Stop ${stop.idStop || 'Unknown'}`
  }
}