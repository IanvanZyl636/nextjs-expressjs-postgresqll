import { LocationModel } from './location.model';

export interface CircuitModel {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: LocationModel;
}
