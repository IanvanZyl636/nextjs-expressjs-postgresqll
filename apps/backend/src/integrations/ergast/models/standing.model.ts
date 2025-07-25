import { DriverStandingModel } from './driver-standing.model';

export interface StandingModel {
  season: string;
  round: string;
  DriverStandings: DriverStandingModel[];
}
