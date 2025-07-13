
import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@Component({
  selector: 'app-map-test',
  standalone : true,
  imports: [ReactiveFormsModule , HttpClientModule , CommonModule , FormsModule] ,
  templateUrl: './map-test.component.html',
  styleUrl: './map-test.component.css'
})
export class MapTestComponent {

  map!: L.Map;
  marker!: L.Marker;

  depart: string = '';
  destination: string = '';
  idBus: number = 2; // valeur par défaut
  intervalId : any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.initMap();
    this.afficherBus(this.idBus);
    this.intervalId = setInterval(() => this.afficherBus(this.idBus), 2000);
}

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  initMap(): void {
    this.map = L.map('map').setView([35.8256, 10.6084], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  calculateRoute(): void {
    if (!this.depart || !this.destination) return;

    const [depLat, depLng] = this.depart.split(',').map(Number);
    const [destLat, destLng] = this.destination.split(',').map(Number);

    const url = `https://router.project-osrm.org/route/v1/driving/${depLng},${depLat};${destLng},${destLat}?overview=full&geometries=geojson`;

    this.http.get(url).subscribe((res: any) => {
      const coords = res.routes[0].geometry.coordinates;
      const latlngs = coords.map(([lng, lat]: [number, number]) => L.latLng(lat, lng));

      const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(this.map);
      this.map.fitBounds(polyline.getBounds());

      const busIcon = L.icon({
        iconUrl: '/bus6.jpg',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      if (this.marker) this.marker.remove();

      this.marker = L.marker(latlngs[0], { icon: busIcon }).addTo(this.map);
      this.animateBus(latlngs);
    });
  }

  animateBus(route: L.LatLng[]) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < route.length) {
        this.marker.setLatLng(route[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  async afficherBus(id: number) {
    try {
      const response = await fetch(`http://localhost:8080/busPosition/lastPosition/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      const latitude = data.latitude;
      const longitude = data.longitude;
      const time = data.time;

      const timeDiff = Date.now() - time;

      




      console.log(`Bus ${id} → Latitude: ${latitude}, Longitude: ${longitude} , TimeStamp : ${time}` , "difference : " + timeDiff);
      this.updateMap(latitude, longitude);
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
    }
  }



    //Condition of Time
    /*async afficherBus(id: number) {
    try {
      const response = await fetch(`http://localhost:8080/busPosition/lastPosition/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      const latitude = data.latitude;
      const longitude = data.longitude;
      const time = data.time;

      const timeDiff = Date.now()-time;

      if(timeDiff <= 3000){
        console.log(`Bus ${id} → Latitude: ${latitude}, Longitude: ${longitude}`);
        this.updateMap(latitude, longitude);
      }
      else {
        console.log(`Bus ${id} → Latitude: ${latitude}, Longitude: ${longitude} , Time : ${time}`);
      }
      
    } catch (error) {
      console.error('Erreur lors de la récupération de la position:', error);
    }
  }*/


  
  updateMap(latitude: number, longitude: number): void {
    const busIcon = L.icon({
      iconUrl: '/bus6.jpg',
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    const position = L.latLng(latitude, longitude);

    if (this.marker) {
      this.marker.setLatLng(position);
    } else {
      this.marker = L.marker(position, { icon: busIcon }).addTo(this.map);
    }

    this.map.setView(position, 15);
  }
}








