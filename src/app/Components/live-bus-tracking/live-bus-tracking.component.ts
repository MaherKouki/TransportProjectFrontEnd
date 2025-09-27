import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BusPositionService } from '../../service/BusPositionService/bus-position.service';
import { BusPosition } from '../../entity/busPosition';

@Component({
  selector: 'app-live-bus-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-bus-tracking.component.html',
  styleUrls: ['./live-bus-tracking.component.css']
})
export class LiveBusTrackingComponent implements OnInit, OnDestroy {

  private map!: L.Map;
  private marker!: L.Marker;
   intervalId: any;
  private path: L.Polyline | null = null;
   lastPosition: L.LatLng | null = null;
  private initialZoom = 9; // store initial zoom

  busId!: number;
  vitesse = 2000; // fetch every 2 seconds
  positions: L.LatLng[] = [];

  constructor(
    private busPositionService: BusPositionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get busId from URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('busId');
      if (id) this.busId = +id;

      this.initMap();
      this.loadLastPosition(); // load last position on map
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  // Initialize map and marker
  private initMap(): void {
    this.map = L.map('map').setView([36.8, 10.18], this.initialZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    const busIcon = L.icon({
      iconUrl: 'bus.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    this.marker = L.marker([36.8, 10.18], { icon: busIcon }).addTo(this.map);
  }

  // Load last known position of the bus
  private loadLastPosition(): void {
    this.busPositionService.getLastPosition(this.busId).subscribe({
      next: (pos: BusPosition) => {
        if (pos?.latitude && pos?.longitude) {
          const lastLatLng = L.latLng(pos.latitude, pos.longitude);
          this.marker.setLatLng(lastLatLng);

          // ✅ Restore initial zoom instead of forcing zoom 13
          this.map.setView(lastLatLng, this.initialZoom);

          this.positions.push(lastLatLng);
          this.path = L.polyline(this.positions, { color: 'blue' }).addTo(this.map);
          this.lastPosition = lastLatLng;
        }
      },
      error: (err) => console.error('Error fetching last position:', err)
    });
  }

  // Start live tracking
  startTracking(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.positions = [];
    if (this.path) this.map.removeLayer(this.path);

    this.intervalId = setInterval(() => {
      this.busPositionService.getLastPosition(this.busId).subscribe({
        next: (pos: BusPosition) => {
          if (pos?.latitude && pos?.longitude) {
            const newLatLng = L.latLng(pos.latitude, pos.longitude);
            this.updateMarkerPosition(newLatLng);
          }
        },
        error: (err) => console.error('Error fetching position:', err),
      });
    }, this.vitesse);
  }

  // Animate smoothly and draw path
  private updateMarkerPosition(newLatLng: L.LatLng): void {
    if (this.lastPosition) {
      const steps = 20;
      let step = 0;
      const latStep = (newLatLng.lat - this.lastPosition.lat) / steps;
      const lonStep = (newLatLng.lng - this.lastPosition.lng) / steps;

      const interval = setInterval(() => {
        step++;
        const currentLat = this.lastPosition!.lat + latStep * step;
        const currentLon = this.lastPosition!.lng + lonStep * step;
        const current = L.latLng(currentLat, currentLon);
        this.marker.setLatLng(current);
        if (step >= steps) clearInterval(interval);
      }, this.vitesse / steps);
    } else {
      this.marker.setLatLng(newLatLng);
    }

    this.positions.push(newLatLng);
    if (this.path) this.path.setLatLngs(this.positions);
    else this.path = L.polyline(this.positions, { color: 'blue' }).addTo(this.map);

    this.lastPosition = newLatLng;
    this.map.panTo(newLatLng);
  }




  
}
