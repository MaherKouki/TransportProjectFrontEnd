import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bus } from '../../entity/bus';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  private baseUrl = 'http://localhost:8080/bus'; // adapte selon ton backend

  constructor(private http: HttpClient) {}

  // Ajouter un bus
  addBus(bus: Bus): Observable<Bus> {
    return this.http.post<Bus>(`${this.baseUrl}/addBus`, bus);
  }

  // Récupérer tous les bus
  getAllBuses(): Observable<Bus[]> {
    return this.http.get<Bus[]>(`${this.baseUrl}/getAllBuses`);
  }

  // Récupérer un bus par ID
  getBusById(busId: number): Observable<Bus> {
    return this.http.get<Bus>(`${this.baseUrl}/getBusById/${busId}`);
  }

  // Supprimer un bus
  removeBus(busId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/removeBus/${busId}`);
  }

  // Affecter un itinéraire à un bus
  affectItineraryToBus(busId: number, itineraryId: number): Observable<string> {
    return this.http.post(`${this.baseUrl}/itineraries/${busId}/${itineraryId}`, {}, { responseType: 'text' });
  }
}
