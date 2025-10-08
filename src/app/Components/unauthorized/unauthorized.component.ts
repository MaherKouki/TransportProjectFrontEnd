import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="unauthorized-container">
      <mat-card class="error-card">
        <mat-icon class="error-icon">block</mat-icon>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p class="role-info">Your current role: <strong>{{ getUserRole() }}</strong></p>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Go Back
          </button>
          <button mat-raised-button (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
    }
    .error-card {
      text-align: center;
      max-width: 500px;
      padding: 40px;
    }
    .error-icon {
      font-size: 100px;
      width: 100px;
      height: 100px;
      color: #f44336;
      margin-bottom: 20px;
    }
    h1 {
      color: #333;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
    .role-info {
      font-size: 14px;
      background: #fff3cd;
      padding: 10px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router, private authService: AuthService) {}

  goBack(): void {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'ADMIN') {
      this.router.navigate(['/dashboard']);
    } else if (user?.role === 'DRIVER') {
      this.router.navigate(['/trackBus']);
    } else {
      this.router.navigate(['/userItinerary']);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  getUserRole(): string {
    return this.authService.getCurrentUser()?.role || 'Unknown';
  }
}