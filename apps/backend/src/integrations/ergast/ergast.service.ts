import {
  MRDataRaceModel,
  MRDataStandingsModel,
} from './models/mr-data.model';
import axios from 'axios';
import { getDriverStandingsLimitOffset } from './ergast.utils';
import { ergastRootApi } from './ergast.constants';

export class ErgastService {
  static readonly getDriverStandings = async (
    startYear: number,
    endYear?: number
  ) => {
    const { limit, offset } = getDriverStandingsLimitOffset(startYear, endYear);

    return (
      await axios.get<{ MRData: MRDataStandingsModel }>(
        `${ergastRootApi}/driverStandings/1.json?limit=${limit}&offset=${offset}`
      )
    ).data;
  };

  static readonly getSeasonResults = async (year: number) =>
    (
      await axios.get<{ MRData: MRDataRaceModel }>(
        `${ergastRootApi}/${year}/results/1.json`
      )
    ).data;
}

