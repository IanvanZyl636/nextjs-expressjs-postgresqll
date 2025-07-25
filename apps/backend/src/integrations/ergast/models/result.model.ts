import { ConstructorModel } from './constructor.model';
import { DriverModel } from './driver.model';
import { FastestLapModel } from './fastest-lap.model';
import { TimeModel } from './time.model';

export interface ResultModel {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: DriverModel;
  Constructor: ConstructorModel;
  grid: string;
  laps: string;
  status: string;
  Time: TimeModel;
  FastestLap: FastestLapModel;
}
