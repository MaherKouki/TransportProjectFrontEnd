import { Itinerary } from "./itinerary";

export interface Stop {
    idStop?: number;
    stopName: string;
    latitude: number;
    longitude: number;
    estimatedTime : string;
    arrivalTime?: number | null;
    orderIndex : number;

    itinerary?: Itinerary;

}