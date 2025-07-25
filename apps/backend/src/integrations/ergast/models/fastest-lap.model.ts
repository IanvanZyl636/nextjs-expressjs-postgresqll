import { AverageSpeedModel } from './average-speed.model';
import { TimeModel } from './time.model';

export interface FastestLapModel {
  rank: string;
  lap: string;
  Time: TimeModel;
  AverageSpeed: AverageSpeedModel;
}
