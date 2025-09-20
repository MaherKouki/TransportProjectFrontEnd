// import { Component, Inject } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { MatButtonModule } from "@angular/material/button"
// import { MatIconModule } from "@angular/material/icon"
// import { MatChipsModule } from "@angular/material/chips"
// import { MatCardModule } from "@angular/material/card"
// import { MatDividerModule } from "@angular/material/divider"
// import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
// import { Itinerary } from "../../entity/itinerary"

// @Component({
//   selector: "app-route-details",
//   templateUrl: "./route-details.component.html",
//   styleUrls: ["./route-details.component.css"],
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatDialogModule,
//     MatButtonModule,
//     MatIconModule,
//     MatChipsModule,
//     MatCardModule,
//     MatDividerModule,
//   ],
// })
// export class RouteDetailsComponent {
//   constructor(
//     public dialogRef: MatDialogRef<RouteDetailsComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: { itinerary: Itinerary },
//   ) {}

//   onClose(): void {
//     this.dialogRef.close()
//   }

//   getIntermediateStops() {
//     if (!this.data.itinerary.stops || this.data.itinerary.stops.length <= 2) {
//       return []
//     }
//     return this.data.itinerary.stops.slice(1, -1)
//   }
// }






import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatChipsModule } from "@angular/material/chips"
import { MatCardModule } from "@angular/material/card"
import { MatDividerModule } from "@angular/material/divider"
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"
import { Itinerary } from "../../entity/itinerary"


@Component({
  selector: "app-route-details",
  templateUrl: "./route-details.component.html",
  styleUrls: ["./route-details.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
  ],
})
export class RouteDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<RouteDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itinerary: Itinerary },
  ) {}

  onClose(): void {
    this.dialogRef.close()
  }

  getIntermediateStops() {
    if (!this.data.itinerary.stops || this.data.itinerary.stops.length <= 2) {
      return []
    }
    return this.data.itinerary.stops.slice(1, -1)
  }
}