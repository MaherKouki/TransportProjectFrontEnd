import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bus } from '../../entity/bus';
import { Observable } from 'rxjs';
import { Stop } from '../../entity/stop';

@Injectable({
  providedIn: 'root'
})
export class StopService {

    private baseUrl = 'http://localhost:8080/stops'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  // Créer un stop
  createStop(stop: Stop): Observable<Stop> {
    return this.http.post<Stop>(`${this.baseUrl}/stop`, stop);
  }
}
