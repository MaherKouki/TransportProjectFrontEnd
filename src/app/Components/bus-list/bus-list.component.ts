// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-bus-list',
//   imports: [],
//   templateUrl: './bus-list.component.html',
//   styleUrl: './bus-list.component.css'
// })
// export class BusListComponent {

// }








import { Component, OnInit } from "@angular/core"
import { Bus } from "../../entity/bus"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { BusService } from "../../service/BusService/bus.service"
import { MatSnackBar } from "@angular/material/snack-bar"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatTableModule } from "@angular/material/table"



@Component({
  selector: "app-bus-list",
  templateUrl: "./bus-list.component.html",
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
    MatProgressSpinnerModule
  ],
  styleUrls: ["./bus-list.component.css"],
})
export class BusListComponent implements OnInit {
  buses: Bus[] = []
  displayedColumns: string[] = ["idBus", "matricule", "marque", "actions"]
  busForm: FormGroup
  loading = false
  editingBus: Bus | null = null

  constructor(
    private busService: BusService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.busForm = this.fb.group({
      matricule: ["", [Validators.required, Validators.minLength(3)]],
      marque: ["", [Validators.required, Validators.minLength(2)]],
    })
  }

  ngOnInit(): void {
    this.loadBuses()
  }

  loadBuses(): void {
    this.loading = true
    this.busService.getAllBuses().subscribe({
      next: (buses) => {
        this.buses = buses
        this.loading = false
      },
      error: (error) => {
        console.error("Error loading buses:", error)
        this.snackBar.open("Error loading buses", "Close", { duration: 3000 })
        this.loading = false
      },
    })
  }

  onSubmit(): void {
    if (this.busForm.valid) {
      const busData: Bus = this.busForm.value

      this.busService.addBus(busData).subscribe({
        next: (newBus) => {
          this.buses.push(newBus)
          this.busForm.reset()
          this.snackBar.open("Bus added successfully", "Close", { duration: 3000 })
        },
        error: (error) => {
          console.error("Error adding bus:", error)
          this.snackBar.open("Error adding bus", "Close", { duration: 3000 })
        },
      })
    }
  }

  deleteBus(bus: Bus): void {
    if (bus.idBus && confirm("Are you sure you want to delete this bus?")) {
      this.busService.removeBus(bus.idBus).subscribe({
        next: () => {
          this.buses = this.buses.filter((b) => b.idBus !== bus.idBus)
          this.snackBar.open("Bus deleted successfully", "Close", { duration: 3000 })
        },
        error: (error) => {
          console.error("Error deleting bus:", error)
          this.snackBar.open("Error deleting bus", "Close", { duration: 3000 })
        },
      })
    }
  }

  editBus(bus: Bus): void {
    this.editingBus = bus
    this.busForm.patchValue({
      matricule: bus.matricule,
      marque: bus.marque,
    })
  }

  cancelEdit(): void {
    this.editingBus = null
    this.busForm.reset()
  }
}
