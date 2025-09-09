import { Bus } from "./bus";
import { BusPositionId } from "./busPositionId";

export interface BusPosition {
  id?: BusPositionId;   // EmbeddedId → optionnel si renvoyé dans l’API

  latitude: number;     // exposé via @JsonProperty
  longitude: number;    // exposé via @JsonProperty

  busId: number;        // exposé via @JsonProperty
  time: number;         // exposé via @JsonProperty (timestamp)

  savedAt?: string;     // Instant → string (format ISO-8601 : 2025-09-05T12:34:56Z)

  bus?: Bus;            // relation ManyToOne vers Bus (optionnelle selon API)
}




