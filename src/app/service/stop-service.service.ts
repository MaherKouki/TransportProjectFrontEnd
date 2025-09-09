


// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Stop } from '../entity/stop';

// @Injectable({
//   providedIn: 'root'
// })
// export class StopService {
//   private apiUrl = "http://localhost:8080/itinerary";
  
//   constructor(private http: HttpClient) {}
  
//   // Create a new stop
//   createStop(stop: Stop): Observable<Stop> {
//     console.log("Creating stop:", stop);
//     return this.http.post<Stop>(`${this.apiUrl}/stops`, stop);
//   }

//   // Get all stops
//   getAllStops(): Observable<Stop[]> {
//     return this.http.get<Stop[]>(`${this.apiUrl}/stops`);
//   }




// }