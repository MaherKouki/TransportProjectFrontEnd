import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DriverResponse {
  username: string;
  email: string;
  role: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  createDriver(driverData: any): Observable<DriverResponse> {
    return this.http.post<DriverResponse>(`${this.baseUrl}/create-driver`, driverData);
  }
}