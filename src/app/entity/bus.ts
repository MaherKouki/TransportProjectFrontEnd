import { BusPosition } from "./busPosition";
import { Itinerary } from "./itinerary";


export interface Bus {
  idBus: number;          // Long → number
  matricule: string;      // unique immatriculation
  marque: string;         // marque du bus

  // Relations
  busPosition?: BusPosition[];   // OneToMany (optionnel)
  itineraries?: Itinerary[];     // ManyToMany (optionnel)
}
