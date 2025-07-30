import { Itinerary } from "./itinerary";

export interface Stop {
    id?: number;
    stopName: string;
    laltitude: number;
    longitude: number;
    estimatedTime : string;
    arrivalTime: number;
    orderIndex : number;

    itinerary: Itinerary;

}