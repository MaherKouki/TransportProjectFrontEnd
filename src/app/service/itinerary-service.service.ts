// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Itinerary } from '../entity/itinerary';
// import { Observable } from 'rxjs';
// import { Stop } from '../entity/stop';

// @Injectable({
//   providedIn: 'root'
// })
// export class ItineraryServiceService {
  
//   private apiUrl = "http://localhost:8080/itinerary";
  
//   constructor(private http: HttpClient) {}
  
//   // Create itinerary with Stop entities
//   createItineraryWithStops(departure: Stop, destination: Stop): Observable<Itinerary> {
//     const requestBody = {
//       departure: departure,
//       destination: destination
//     };
    
//     console.log("Creating itinerary with stops:", requestBody);
//     return this.http.post<Itinerary>(`${this.apiUrl}/create`, requestBody);
//   }
  
//   // Create individual stop
//   createStop(stop: Stop): Observable<Stop> {
//     console.log("Creating stop:", stop);
//     return this.http.post<Stop>(`${this.apiUrl}/stops`, stop);
//   }

//   // Get all itineraries
//   getAllItineraries(): Observable<Itinerary[]> {
//     return this.http.get<Itinerary[]>(`${this.apiUrl}/all`);
//   }
// }