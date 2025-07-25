import {firstRecordedYear} from '@nextjs-expressjs-postgre-sql/shared'

export const getDriverStandingsLimitOffset = (
  startYear: number,
  endYear = -1
) => {
  if (startYear < firstRecordedYear) {
    startYear = firstRecordedYear;
  }

  if (endYear === -1) {
    endYear = new Date().getFullYear();
  }

  if (endYear < firstRecordedYear) {
    endYear = firstRecordedYear;
  }

  if (startYear > endYear) {
    const tempYear = startYear;
    startYear = endYear;
    endYear = tempYear;
  }

  const limit = endYear - startYear + 1;
  const offset = startYear - firstRecordedYear;

  return { limit, offset };
};