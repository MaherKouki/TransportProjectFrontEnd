import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map!: L.Map;
  marker!: L.Marker;
  vitesse: number = 1000; // delay in ms between movements
  selectedPosition: L.LatLng | null = null;

  constructor() {}

  ngOnInit(): void {
    this.initMap();

    const positions: L.LatLng[] = [
      L.latLng(35.8256, 10.6084), // Sousse
      L.latLng(35.9, 10.5),
      L.latLng(36.0, 10.4),
      L.latLng(36.2, 10.3),
      L.latLng(36.4, 10.25),
      L.latLng(36.6, 10.2),
      L.latLng(36.8, 10.15),
      L.latLng(37, 10.1),
      L.latLng(36.8065, 10.1815), // Tunis
    ];

    this.drawRoute(positions);
    // this.animateBus(positions);
  }

  initMap(): void {
    this.map = L.map('map').setView([35.8256, 10.6084], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // ✅ Click listener to select a position
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.selectedPosition = e.latlng;

      // Remove old marker if exists
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      // Add marker at clicked position
      const customIcon = L.icon({
      iconUrl: '/marker1.png', // ✅ your image path here
      iconSize: [40, 40],              // adjust as needed
      iconAnchor: [20, 40],            // anchor point of the icon
      shadowUrl: '',                   // optional: remove shadow
    });

    this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map);
    });
  }

  drawRoute(positions: L.LatLng[]) {
    L.polyline(positions, { color: 'blue' }).addTo(this.map);
    this.map.fitBounds(L.polyline(positions).getBounds());

    const busIcon = L.icon({
      iconUrl: '/bus6.jpg', // make sure this image exists in src/assets
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    // Create initial marker (this will be replaced on click)
    this.marker = L.marker(positions[0], { icon: busIcon }).addTo(this.map);
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
    }, this.vitesse);
  }

  logPosition() {
    if (this.selectedPosition) {
      console.log('Latitude:', this.selectedPosition.lat);
      console.log('Longitude:', this.selectedPosition.lng);
    } else {
      console.log('Aucune position sélectionnée');
    }
  }
}
