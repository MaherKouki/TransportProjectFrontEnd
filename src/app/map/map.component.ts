import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map',
  standalone: true,
  template: `<div #mapDiv style="height:500px;width:100%"></div>`,
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapDiv', { static: false }) mapElementRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    if (!this.mapElementRef) {
      console.error('mapDiv not found');
      return;
    }

    const map = new google.maps.Map(this.mapElementRef.nativeElement, {
      center: { lat: 36.8065, lng: 10.1815 },
      zoom: 7,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({ map });

    directionsService.route(
      {
        origin: 'Tunis, Tunisia',
        destination: 'Sousse, Tunisia',
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );
  }
}
