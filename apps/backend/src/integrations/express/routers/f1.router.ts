import { Router } from 'express';
import { getChampionBySeasonsController, getRaceWinnersBySeasonController } from '../controllers/f1.controller';
import { asyncHandler } from '../middleware/async-handler.middleware';

const router = Router();

/**
 * @swagger
 * /api/seasons/champions:
 *  get:
 *   summary: Get all season with their champion.
 *   parameters:
 *    - name: startYear
 *      in: query
 *      description: Start year of the seasons you want to fetch starting from 1950.
 *      required: true
 *      schema:
 *       type: integer
 *    - name: endYear
 *      in: query
 *      description: End year of the seasons you want if blank will default to the last year.
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: a List of seasons with their champion.
 */
router.get('/seasons/champions', asyncHandler(getChampionBySeasonsController));

/**
 * @swagger
 * /api/season/race-winners:
 *  get:
 *   summary: Get a specific season with all the race winners
 *   parameters:
 *    - name: seasonYear
 *      in: query
 *      description: Season year of the season you want to fetch starting from 1950.
 *      required: true
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: a season with a list of all the race winners.
 */
router.get('/season/race-winners', asyncHandler(getRaceWinnersBySeasonController));

export default router;