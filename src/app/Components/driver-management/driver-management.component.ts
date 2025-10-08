import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DriverService } from '../../service/driverService/driver.service';
import { AdminHeaderComponent } from "../admin-header/admin-header.component";


@Component({
  selector: 'app-driver-management',
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
    MatSnackBarModule,
    AdminHeaderComponent
],
  templateUrl: './driver-management.component.html',
  styleUrls: ['./driver-management.component.css']
})
export class DriverManagementComponent {
  driverData = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  };
  
  loading = false;
  hidePassword = true;

  constructor(
    private driverService: DriverService,
    private snackBar: MatSnackBar
  ) {}

  onCreateDriver(): void {
    if (!this.driverData.username || !this.driverData.email || !this.driverData.password) {
      this.snackBar.open('Please fill in required fields', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    this.driverService.createDriver(this.driverData).subscribe({
      next: (response) => {
        this.snackBar.open('Driver account created successfully!', 'Close', { duration: 3000 });
        this.resetForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Create driver error:', error);
        const errorMessage = error.error || 'Failed to create driver account';
        this.snackBar.open(errorMessage, 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.driverData = {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    };
  }
}