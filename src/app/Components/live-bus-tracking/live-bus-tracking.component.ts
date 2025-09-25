import { Component } from '@angular/core';
import { BusPositionService } from '../../service/BusPositionService/bus-position.service';
import { OnDestroy, OnInit } from '@angular/core'
import * as L from 'leaflet'

import { BusPosition } from '../../entity/busPosition'


@Component({
  selector: 'app-live-bus-tracking',
  imports: [],
  templateUrl: './live-bus-tracking.component.html',
  styleUrl: './live-bus-tracking.component.css'
})
export class LiveBusTrackingComponent implements OnInit , OnDestroy{

private map!: L.Map
  private marker!: L.Marker
  private intervalId: any
  private path: L.Polyline | null = null
  private lastPosition: L.LatLng | null = null

  busId: number = 2 // default bus
  vitesse = 2000 // fetch every 2 seconds
  positions: L.LatLng[] = []

  constructor(private busPositionService: BusPositionService) {}

  ngOnInit(): void {
    this.initMap()
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId)
  }

  // ✅ Initialize map and marker
  private initMap(): void {
    this.map = L.map('map').setView([36.8, 10.18], 9)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map)

    const busIcon = L.icon({
      iconUrl: '/assets/bus6.jpg',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    })

    this.marker = L.marker([36.8, 10.18], { icon: busIcon }).addTo(this.map)
  }

  // ✅ Called when user clicks "Start Tracking"
  startTracking(): void {
    if (this.intervalId) clearInterval(this.intervalId)
    this.positions = []
    if (this.path) this.map.removeLayer(this.path)

    this.intervalId = setInterval(() => {
      this.busPositionService.getLastPosition(this.busId).subscribe({
        next: (pos: BusPosition) => {
          if (pos?.latitude && pos?.longitude) {
            const newLatLng = L.latLng(pos.latitude, pos.longitude)
            this.updateMarkerPosition(newLatLng)
          }
        },
        error: (err) => console.error('Error fetching position:', err),
      })
    }, this.vitesse)
  }

  // ✅ Animate smoothly between old and new positions
  private updateMarkerPosition(newLatLng: L.LatLng): void {
    if (this.lastPosition) {
      const steps = 20 // smoothness level
      let step = 0
      const latStep = (newLatLng.lat - this.lastPosition.lat) / steps
      const lonStep = (newLatLng.lng - this.lastPosition.lng) / steps

      const interval = setInterval(() => {
        step++
        const currentLat = this.lastPosition!.lat + latStep * step
        const currentLon = this.lastPosition!.lng + lonStep * step
        const current = L.latLng(currentLat, currentLon)
        this.marker.setLatLng(current)
        if (step >= steps) clearInterval(interval)
      }, this.vitesse / steps)
    } else {
      this.marker.setLatLng(newLatLng)
    }

    // Add to path
    this.positions.push(newLatLng)
    if (this.path) this.path.setLatLngs(this.positions)
    else this.path = L.polyline(this.positions, { color: 'blue' }).addTo(this.map)

    // Update last position
    this.lastPosition = newLatLng
    this.map.panTo(newLatLng)
  }
}
