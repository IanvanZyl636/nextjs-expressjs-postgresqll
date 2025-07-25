import { RaceTableModel } from './race-table.model';
import { StandingsTableModel } from './standings-table.model';

export interface MRDataBaseModel {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
}

export interface MRDataStandingsModel extends MRDataBaseModel {
  StandingsTable: StandingsTableModel;
}

export interface MRDataRaceModel extends MRDataBaseModel {
  RaceTable: RaceTableModel;
}
