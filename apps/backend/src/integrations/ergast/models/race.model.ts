import { CircuitModel } from './circuit.model';
import { ResultModel } from './result.model';

export interface RaceModel {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: CircuitModel;
  date: string;
  time: string;
  Results: ResultModel[];
}
