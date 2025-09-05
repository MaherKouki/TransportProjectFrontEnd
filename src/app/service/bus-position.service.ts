import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusPositionService {

  constructor(private http:HttpClient) { }


  private apiUrl = 'http://localhost:8080/busPosition';


  //private apiUrl = "https://9d315def5abf.ngrok-free.app/busPosition";


  //private apiUrl = "https://rude-donuts-pick.loca.lt/busPosition";




  sendPosition(busId: number, lat: number, lon: number) {
    const params = {
      busId: busId,
      latitude: lat,
      longitude: lon,
      time: Date.now()
    };
    return this.http.post(this.apiUrl+ '/savePosition', null, { params });
  }


  /*sendPosition(busId: number, lat: number, lon: number) {
  const body = {
    busId: busId,
    lat: lat,
    lon: lon,
    time: Date.now()
  };
  return this.http.post(this.apiUrl + '/locationn', body);
}*/

}
