import { getDriverStandingsLimitOffset } from './ergast.utils';
import axios from 'axios';
import { ErgastService } from './ergast.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ergast service', () => {
  it('should fetch driver standings', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        MRData: {
          StandingsTable: {
            StandingsLists: [
              {
                season: '2023',
              },
            ],
          },
        },
      },
    });

    const result = await ErgastService.getDriverStandings(2023);
    expect(result.MRData.StandingsTable.StandingsLists[0].season).toBe('2023');
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/driverStandings/1.json')
    );
  });

  it('should fetch season results', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        MRData: {
          RaceTable: {
            season: '2023',
            Races: [],
          },
        },
      },
    });

    const result = await ErgastService.getSeasonResults(2023);
    expect(result.MRData.RaceTable.season).toBe('2023');
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://ergast.com/api/f1/2023/results/1.json'
    );
  });
});

describe('ergast utils', () => {
  it('getDriverStandingsLimitOffset no endYear', () => {
    const limitOffset = getDriverStandingsLimitOffset(2005);

    expect(limitOffset.limit).toBe(21);
    expect(limitOffset.offset).toBe(55);
  });

  it('getDriverStandingsLimitOffset startYear lower than firstRecordedYear', () => {
    const limitOffset = getDriverStandingsLimitOffset(1800);

    expect(limitOffset.offset).toBe(0);
  });

  it('getDriverStandingsLimitOffset endYear lower than firstRecordedYear', () => {
    const limitOffset = getDriverStandingsLimitOffset(2005, 1800);

    expect(limitOffset.offset).toBe(0);
    expect(limitOffset.limit).toBe(56);
  });
});
