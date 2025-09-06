import { Injectable } from '@angular/core';
import { BusPosition } from '../../entity/busPosition';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Stop } from '../../entity/stop';

@Injectable({
  providedIn: 'root'
})
export class BusPositionService {

  private apiUrl = 'http://localhost:8080/busPosition';

  constructor(private http: HttpClient) {}

  // ✅ 1. Get nearest stop
  getNearestStop(latitude: number, longitude: number, destinationId: number): Observable<Stop> {
    return this.http.get<Stop>(`${this.apiUrl}/nearest`, {
      params: { latitude, longitude, destinationId }
    });
  }

  // ✅ 2. Get travel time (minutes) to nearest stop
  getTravelTime(latitude: number, longitude: number, destinationId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/nearest-time`, {
      params: { latitude, longitude, destinationId }
    });
  }

  // ✅ 3. Distance between bus and stop
  getDistanceBusToStop(busId: number, stopId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${busId}/distance-to-stop/${stopId}`);
  }

  // ✅ 4. Save new bus position
  saveBusPosition(busId: number, latitude: number, longitude: number, time: number): Observable<BusPosition> {
    return this.http.post<BusPosition>(`${this.apiUrl}/savePosition`, null, {
      params: { busId, latitude, longitude, time }
    });
  }

  // ✅ 5. Update bus position with JSON body
  updatePosition(busId: number, position: BusPosition): Observable<any> {
    return this.http.post(`${this.apiUrl}/position/${busId}`, position, { responseType: 'text' });
  }

  // ✅ 6. Get last position of a bus
  getLastPosition(busId: number): Observable<BusPosition> {
    return this.http.get<BusPosition>(`${this.apiUrl}/lastPosition/${busId}`);
  }

  // ✅ 7. Get all positions of a bus
  getPositionsPerBus(busId: number): Observable<BusPosition[]> {
    return this.http.get<BusPosition[]>(`${this.apiUrl}/getPositionPerBus/${busId}`);
  }

  // ✅ 8. Update manually via params
  updateLocation(busId: number, latitude: number, longitude: number, timestamp?: number): Observable<BusPosition> {
    const params: any = { busId, latitude, longitude };
    if (timestamp) params.timestamp = timestamp;
    return this.http.post<BusPosition>(`${this.apiUrl}/update`, null, { params });
  }

  // ✅ 9. Get latest position of a bus
  getLatestLocation(busId: number): Observable<BusPosition> {
    return this.http.get<BusPosition>(`${this.apiUrl}/latest/${busId}`);
  }
}
