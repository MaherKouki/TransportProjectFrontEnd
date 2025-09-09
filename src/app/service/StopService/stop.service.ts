// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Bus } from '../../entity/bus';
// import { Observable } from 'rxjs';
// import { Stop } from '../../entity/stop';

// @Injectable({
//   providedIn: 'root'
// })
// export class StopService {

//     private baseUrl = 'http://localhost:8080/stops'; // adapte selon ton backend

//   constructor(private http: HttpClient) {}

//   // Créer un stop
//   createStop(stop: Stop): Observable<Stop> {
//     return this.http.post<Stop>(`${this.baseUrl}/stop`, stop);
//   }
// }









import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Stop } from "../../entity/stop"
import { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class StopService {
  private baseUrl = "http://localhost:8080/stops"

  constructor(private http: HttpClient) {}

  createStop(stop: Stop): Observable<Stop> {
    return this.http.post<Stop>(`${this.baseUrl}/stop`, stop)
  }

  getAllStops(): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${this.baseUrl}/getAllStops`)
  }

  updateStop(stopId: number, stop: Stop): Observable<Stop> {
    return this.http.put<Stop>(`${this.baseUrl}/updateStop/${stopId}`, stop)
  }

  deleteStop(stopId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteStop/${stopId}`)
  }
}
