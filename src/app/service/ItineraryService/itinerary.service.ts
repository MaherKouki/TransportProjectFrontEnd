// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Itinerary } from '../../entity/itinerary';
// import { Stop } from '../../entity/stop';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class ItineraryService {

//   private baseUrl = 'http://localhost:8080/itinerary'; // adapte si nécessaire

//   constructor(private http: HttpClient) {}

//   // Créer un itinéraire à partir de departure + destination
//   createItinerary(departure: Stop, destination: Stop): Observable<Itinerary> {
//     const body = { departure, destination };
//     return this.http.post<Itinerary>(`${this.baseUrl}/create`, body);
//   }

//   // Rechercher des itinéraires par point de départ
//   getItinerariesByDeparture(departurePoint: string): Observable<Itinerary[]> {
//     return this.http.get<Itinerary[]>(`${this.baseUrl}/getItineraryByDeparture/${departurePoint}`);
//   }

//   // Rechercher des itinéraires par point de destination
//   getItinerariesByDestination(destinationPoint: string): Observable<Itinerary[]> {
//     return this.http.get<Itinerary[]>(`${this.baseUrl}/getItineraryByDestination/${destinationPoint}`);
//   }

//   // Rechercher des itinéraires par stop
//   getItinerariesByStop(stopPoint: string): Observable<Itinerary[]> {
//     return this.http.get<Itinerary[]>(`${this.baseUrl}/getItineraryByStop/${stopPoint}`);
//   }

//   // Récupérer les stops d’un itinéraire
//   getStopsByItinerary(itineraryName: string): Observable<Stop[]> {
//     return this.http.get<Stop[]>(`${this.baseUrl}/getStopByItinerary/${itineraryName}`);
//   }

//   // Récupérer tous les itinéraires
//   getAllItineraries(): Observable<Itinerary[]> {
//     return this.http.get<Itinerary[]>(`${this.baseUrl}/getAllItineraries`);
//   }

//   // Ajouter des stops à un itinéraire existant
//   addStopsToItinerary(idItinerary: number, stops: Stop[]): Observable<void> {
//     return this.http.post<void>(`${this.baseUrl}/add-stops/${idItinerary}`, stops);
//   }
// }








import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Stop } from "../../entity/stop"
import { Itinerary } from "../../entity/itinerary"
import { Observable } from "rxjs"

//import type { Itinerary, Stop } from "../models/bus.model"

@Injectable({
  providedIn: "root",
})
export class ItineraryService {
  private baseUrl = "http://localhost:8080/itinerary"

  constructor(private http: HttpClient) {}



    // Create itinerary with Stop entities
  createItineraryWithStops(departure: Stop, destination: Stop): Observable<Itinerary> {
    const requestBody = {
      departure: departure,
      destination: destination
    };
    
    console.log("Creating itinerary with stops:", requestBody);
    return this.http.post<Itinerary>(`${this.baseUrl}/create`, requestBody);
  }

  addStopsToItinerary(idItinerary: number, stops: Stop[]): Observable<void> {
    console.log("Adding stops to itinerary:", {
      idItinerary: idItinerary,
      stops: stops,
    })

    return this.http.post<void>(`${this.baseUrl}/add-stops/${idItinerary}`, stops)
  }



  createItinerary(departure: Stop, destination: Stop): Observable<Itinerary> {
    const body = { departure, destination }
    return this.http.post<Itinerary>(`${this.baseUrl}/create`, body)
  }

  getItinerariesByDeparture(departurePoint: string): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.baseUrl}/getItineraryByDeparture/${departurePoint}`)
  }

  getItinerariesByDestination(destinationPoint: string): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.baseUrl}/getItineraryByDestination/${destinationPoint}`)
  }

  getItinerariesByStop(stopPoint: string): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.baseUrl}/getItineraryByStop/${stopPoint}`)
  }

  getStopsByItinerary(itineraryName: string): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${this.baseUrl}/getStopByItinerary/${itineraryName}`)
  }

  getAllItineraries(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.baseUrl}/getAllItineraries`)
  }

  AAAAAAAAaddStopsToItinerary(idItinerary: number, stops: Stop[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/add-stops/${idItinerary}`, stops)
  }
}
