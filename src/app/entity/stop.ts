import { Itinerary } from "./itinerary";

export interface Stop {
    idStop?: number;
    stopName: string ;
    latitude: number;
    longitude: number;
    estimatedTime : string | null;
    arrivalTime?: number | null;
    orderIndex : number;

    itinerary?: Itinerary;

}



/*
export interface Stop {
  idStop: number;
  stopName: string;
  latitude: number;
  longitude: number;
  estimatedTime: string; // HH:mm:ss
  arrivalTime: string;   // HH:mm:ss
  orderIndex: number;

  // Si tu veux représenter la relation ManyToMany (Itinerary)
  itineraries?: Itinerary[];
}

*/