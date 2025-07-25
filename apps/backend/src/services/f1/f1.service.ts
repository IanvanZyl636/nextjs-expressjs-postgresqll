import {prisma} from '../../integrations/prisma';
import {
  createMissingSeasonFromErgastSeason,
  getMissingErgastSeasonWithSeasonRaces,
  getMissingErgastSeasonsWithSeasonRaces,
  getYearsInRange,
  upsertSeasonRaces,
} from './f1.utils';
import { getOrLockAndExecute } from '../../utils/concurrency/code-block-lock.util';
import {
  Prisma, SeasonWithChampionAndConstructorEntity,
  seasonWithChampionAndConstructorQuery, SeasonWithRacesEntity,
  seasonWithRacesQuery
} from '@nextjs-expressjs-postgre-sql/shared';

export class F1Service{
  static readonly getChampionBySeasons = async (
    startYear: number,
    endYear?: number
  ):Promise<SeasonWithChampionAndConstructorEntity[]> => {
    endYear = endYear ?? new Date().getFullYear() - 1;

    const getSeasons = async () =>
      await prisma.season.findMany({
        where: { year: { gte: startYear, lte: endYear } },
        ...seasonWithChampionAndConstructorQuery,
        orderBy: { year: Prisma.SortOrder.asc },
      });

    let seasons = await getSeasons();

    const allYears = getYearsInRange(startYear, endYear);
    const existingYears = new Set(seasons.map((s) => s.year));
    const missingYears = allYears.filter((year) => !existingYears.has(year));

    if (missingYears.length > 0) {
      await getOrLockAndExecute(
        `getChampionBySeasons:${startYear}:${endYear}`,
        async () => {
          const missingErgastSeasons =
            await getMissingErgastSeasonsWithSeasonRaces(
              startYear,
              endYear,
              missingYears
            );

          await Promise.all(
            missingErgastSeasons.map((missingErgastSeason) =>
              createMissingSeasonFromErgastSeason(missingErgastSeason)
            )
          );
        }
      );

      seasons = await getSeasons();
    }

    return seasons;
  };

  static readonly getRaceWinnersBySeason = async (seasonYear: number):Promise<SeasonWithRacesEntity | null> => {
    const getSeason = async () =>
      await prisma.season.findUnique({
        where: { year: seasonYear },
        ...seasonWithRacesQuery
      });

    const season = await getSeason();

    if (season && season.races.length > 0) {
      return season;
    }

    await getOrLockAndExecute(
      `getRaceWinnersBySeason:${seasonYear}`,
      async () => {
        if (!season) {
          const ergastSeason = await getMissingErgastSeasonWithSeasonRaces(
            seasonYear
          );

          const newSeason = await createMissingSeasonFromErgastSeason(
            ergastSeason
          );

          await upsertSeasonRaces(newSeason.id, seasonYear);
        }

        if (season && season.races.length === 0) {
          await upsertSeasonRaces(season.id, seasonYear);
        }
      }
    );

    return getSeason();
  };
}

