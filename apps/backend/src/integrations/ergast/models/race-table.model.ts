import { RaceModel } from './race.model';

export interface RaceTableModel {
  season: string;
  position: string;
  Races: RaceModel[];
}
