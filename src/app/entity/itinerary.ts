import { Stop } from "./stop";

export interface Itinerary {
    idItinerary?: number;
  itineraryName?: string;
  startTime?: string; // LocalTime can be represented as a string (e.g., "08:30")

  stop?: Stop[];

  // Optional helper methods (you can use them in services or components)
  getDeparture?: () => Stop | undefined;
  getDestination?: () => Stop | undefined;
}


export interface Itinerary{


    idItinerary ?: number;
    itineraryName?:string ; 
    startTime?: string;

    stop ?: Stop[];

}