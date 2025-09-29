
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
    return this.http.get<Stop[]>(`${this.baseUrl}/allStops`)
  }

  updateStop(stopId: number, stop: Stop): Observable<Stop> {
    return this.http.put<Stop>(`${this.baseUrl}/updateStop/${stopId}`, stop)
  }

  
  deleteStop(stopId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/deleteStop/${stopId}`, { 
      responseType: 'text' 
    })
  }


  getStopById(stopId: number): Observable<Stop> {
  return this.http.get<Stop>(`${this.baseUrl}/stop/${stopId}`);
}

}
