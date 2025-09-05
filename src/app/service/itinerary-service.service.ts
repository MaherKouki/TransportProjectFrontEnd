// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Itinerary } from '../entity/itinerary';
// import { forkJoin, Observable, switchMap } from 'rxjs';
// import { Stop } from '../entity/stop';
// import { StopService } from './stop-service.service';

// // This interface reflects the expected payload when creating itinerary by IDs
// export interface CreateItineraryRequest {
//   departureId: number;
//   destinationId: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ItineraryServiceService {
  
//   private apiUrl = "http://localhost:8080/itinerary";
  
//   constructor(
//     private http: HttpClient,
//     private stopService: StopService
//   ) {}
  
//   // Save both stops and create itinerary with their IDs
//   createItineraryWithStops(departure: Stop, destination: Stop): Observable<Itinerary> {
//     console.log("Creating itinerary with stops:", { departure, destination });
    
//     // First, save both stops in parallel using StopService
//     return forkJoin({
//       departureStop: this.stopService.createStop(departure),
//       destinationStop: this.stopService.createStop(destination)
//     }).pipe(
//       // Then create the itinerary with the returned stop IDs
//       switchMap(({ departureStop, destinationStop }) => {
//         const request: CreateItineraryRequest = {
//           departureId: departureStop.idStop!,    // assuming your Stop entity uses 'id' as ID field
//           destinationId: destinationStop.idStop!
//         };
        
//         console.log("Creating itinerary with IDs:", request);
//         return this.http.post<Itinerary>(`${this.apiUrl}/create`, request);
//       })
//     );
//   }
  
//   // Direct method to create itinerary with existing stop IDs
//   createItinerary(request: CreateItineraryRequest): Observable<Itinerary> {
//     console.log("Service: sending data:", request);
//     console.log("URL:", `${this.apiUrl}/create`);
    
//     return this.http.post<Itinerary>(`${this.apiUrl}/create`, request);
//   }
// }



import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Itinerary } from '../entity/itinerary';
import { Observable } from 'rxjs';
import { Stop } from '../entity/stop';

@Injectable({
  providedIn: 'root'
})
export class ItineraryServiceService {
  
  private apiUrl = "http://localhost:8080/itinerary";
  
  constructor(private http: HttpClient) {}
  
  // Create itinerary with Stop entities
  createItineraryWithStops(departure: Stop, destination: Stop): Observable<Itinerary> {
    const requestBody = {
      departure: departure,
      destination: destination
    };
    
    console.log("Creating itinerary with stops:", requestBody);
    return this.http.post<Itinerary>(`${this.apiUrl}/create`, requestBody);
  }
  
  // Create individual stop
  createStop(stop: Stop): Observable<Stop> {
    console.log("Creating stop:", stop);
    return this.http.post<Stop>(`${this.apiUrl}/stops`, stop);
  }

  // Get all itineraries
  getAllItineraries(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.apiUrl}/all`);
  }
}