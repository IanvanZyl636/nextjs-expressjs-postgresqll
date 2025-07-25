import { ConstructorModel } from './constructor.model';
import { DriverModel } from './driver.model';

export interface DriverStandingModel {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: DriverModel;
  Constructors: ConstructorModel[];
}
