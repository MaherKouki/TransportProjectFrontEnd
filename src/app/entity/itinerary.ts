import { Stop } from "./stop";

export interface Itinerary {
  idItinerary?: number;
  itineraryName?: string;
  startTime?: string; // LocalTime can be represented as a string (e.g., "08:30")

  stop?: Stop[];
   departure?: Stop;
   destination?: Stop;
   buses?: Bus[];

  // Optional helper methods (you can use them in services or components)
  /*getDeparture?: () => Stop | undefined;
  getDestination?: () => Stop | undefined;*/
}


/*

import { Stop } from './stop.model';
import { Bus } from './bus.model';

export interface Itinerary {
  idItinerary: number;
  itineraryName: string;
  startTime: string;   // HH:mm:ss reçu comme string depuis Spring Boot

  departure: Stop;     // @ManyToOne → objet complet
  destination: Stop;   // @ManyToOne → objet complet

  buses?: Bus[];       // relation ManyToMany
  stops?: Stop[];      // relation ManyToMany
}



*/