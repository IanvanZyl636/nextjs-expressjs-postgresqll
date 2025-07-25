import {
  ErgastService
} from '../../integrations/ergast/ergast.service';
import { DriverStandingModel } from '../../integrations/ergast/models/driver-standing.model';
import {prisma} from '../../integrations/prisma';
import { StandingModel } from '../../integrations/ergast/models/standing.model';
import { DriverModel } from '../../integrations/ergast/models/driver.model';
import { ConstructorModel } from '../../integrations/ergast/models/constructor.model';
import { CircuitModel } from '../../integrations/ergast/models/circuit.model';
import { LocationModel } from '../../integrations/ergast/models/location.model';
import { safeUpsertOrFindUnique } from '../../integrations/prisma/prisma.utils';

export function getYearsInRange(startYear: number, endYear: number) {
  const allYears: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    allYears.push(year);
  }

  return allYears;
}

export const getMissingErgastSeasonsWithSeasonRaces = async (
  startYear: number,
  endYear: number,
  missingYears: number[]
) => {
  const ergastDriverStandings = (await ErgastService.getDriverStandings(startYear, endYear))
    .MRData.StandingsTable.StandingsLists.filter(seasons => missingYears.includes(Number(seasons.season)));

  if (ergastDriverStandings.length !== missingYears.length) {
    throw new Error(
      `getMissingSeasons(${startYear}, ${endYear}, [${missingYears.join(
        ', '
      )}]) Missing seasons mismatch`
    );
  }

  return ergastDriverStandings;
};

export const getMissingErgastSeasonWithSeasonRaces = async (
  seasonYear: number
) => {
  const ergastSeason = (await ErgastService.getDriverStandings(seasonYear, seasonYear))
    ?.MRData?.StandingsTable?.StandingsLists?.[0];

  if (!ergastSeason) {
    throw new Error(`getMissingErgastSeason(${seasonYear} no season found`);
  }

  return ergastSeason;
};

export const createMissingSeasonFromErgastSeason = async (
  ergastSeason: StandingModel
) => {
  const year = Number(ergastSeason.season);
  const driverStanding = ergastSeason.DriverStandings?.[0] as
    | DriverStandingModel
    | undefined;
  const driver = driverStanding?.Driver;
  const constructor = driverStanding?.Constructors?.[0];

  if (!driver || !constructor) {
    throw new Error('Driver or Constructor data is missing');
  }

  const savedDriver = await upsertDriver(driver);
  const savedConstructor = await upsertTeamConstructor(constructor);

  return await safeUpsertOrFindUnique(prisma.season, {
    where: {
      year,
    },
    update: {
      championId: savedDriver.id,
      championConstructorId: savedConstructor.id,
    },
    create: {
      year,
      championId: savedDriver.id,
      championConstructorId: savedConstructor.id,
    },
  });
};

export const upsertDriver = (ergastDriver: DriverModel) =>
  safeUpsertOrFindUnique(prisma.driver, {
    where: {
      driverId: ergastDriver.driverId,
    },
    update: {
      fullName: ergastDriver.familyName,
      code: ergastDriver.code,
      nationality: ergastDriver.nationality,
    },
    create: {
      driverId: ergastDriver.driverId,
      fullName: ergastDriver.familyName,
      code: ergastDriver.code,
      nationality: ergastDriver.nationality,
    },
  });

export const upsertTeamConstructor = (ergastConstructor: ConstructorModel) =>
  safeUpsertOrFindUnique(prisma.teamConstructor, {
    where: {
      constructorId: ergastConstructor.constructorId,
    },
    update: {
      name: ergastConstructor.name,
      nationality: ergastConstructor.nationality,
    },
    create: {
      constructorId: ergastConstructor.constructorId,
      name: ergastConstructor.name,
      nationality: ergastConstructor.nationality,
    },
  });

export const upsertCircuit = (locationId: string, circuit: CircuitModel) =>
  safeUpsertOrFindUnique(prisma.circuit, {
    where: {
      circuitId: circuit.circuitId,
    },
    update: {
      circuitName: circuit.circuitName,
      locationId,
    },
    create: {
      circuitId: circuit.circuitId,
      circuitName: circuit.circuitName,
      locationId,
    },
  });

export const upsertLocation = (location: LocationModel) =>
  safeUpsertOrFindUnique(prisma.location, {
    where: {
      lat_long: {
        lat: location.lat,
        long: location.long,
      },
    },
    create: {
      lat: location.lat,
      long: location.long,
      locality: location.locality,
      country: location.country,
    },
    update: {
      locality: location.locality,
      country: location.country,
    },
  });

export const upsertSeasonRaces = async (
  seasonId: string,
  seasonYear: number
) => {
  const ergastSeasonRaces = (await ErgastService.getSeasonResults(seasonYear)).MRData
    .RaceTable.Races;

  for (const ergastRace of ergastSeasonRaces) {
    const ergastRaceCircuit = ergastRace.Circuit;
    const ergastRaceCircuitLocation = ergastRaceCircuit.Location;
    const ergastRaceWinnerResult = ergastRace.Results?.[0];
    const ergastRaceWinnerDriver = ergastRaceWinnerResult?.Driver;
    const ergastRaceWinnerDriverConstructor =
      ergastRaceWinnerResult?.Constructor;

    if (
      !ergastRaceWinnerDriver ||
      !ergastRaceWinnerDriverConstructor ||
      !ergastRaceCircuitLocation ||
      !ergastRaceCircuit
    ) {
      throw new Error(`upsertSeasonRaces(${seasonId}) ergast data missing
        {
          ergastRaceCircuit: ${ergastRaceCircuit},
          ergastRaceCircuitLocation: ${ergastRaceCircuitLocation},
          ergastRaceWinnerDriver: ${ergastRaceWinnerDriver},
          ergastRaceWinnerDriverConstructor: ${ergastRaceWinnerDriverConstructor}
        }
      `);
    }

    const savedCircuitLocation = await upsertLocation(
      ergastRaceCircuitLocation
    );
    const savedCircuit = await upsertCircuit(
      savedCircuitLocation.id,
      ergastRaceCircuit
    );
    const savedDriver = await upsertDriver(ergastRaceWinnerDriver);
    const savedConstructor = await upsertTeamConstructor(
      ergastRaceWinnerDriverConstructor
    );

    await safeUpsertOrFindUnique(prisma.race, {
      where: {
        seasonId_round: {
          seasonId,
          round: Number(ergastRace.round),
        },
      },
      update: {
        name: ergastRace.raceName,
        startedAt: new Date(`${ergastRace.date}T${ergastRace.time}`),
        points: Number(ergastRaceWinnerResult.points),
        laps: Number(ergastRaceWinnerResult.laps),
        circuitId: savedCircuit.id,
        winnerId: savedDriver.id,
        winnerConstructorId: savedConstructor.id,
      },
      create: {
        name: ergastRace.raceName,
        round: Number(ergastRace.round),
        startedAt: new Date(`${ergastRace.date}T${ergastRace.time}`),
        points: Number(ergastRaceWinnerResult.points),
        laps: Number(ergastRaceWinnerResult.laps),
        seasonId,
        circuitId: savedCircuit.id,
        winnerId: savedDriver.id,
        winnerConstructorId: savedConstructor.id,
      },
    });
  }
};
