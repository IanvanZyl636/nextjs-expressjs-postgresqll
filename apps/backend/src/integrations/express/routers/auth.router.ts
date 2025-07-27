import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler.middleware';
import {login, register} from '../controllers/auth.controller'

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *   summary: User register
 *   parameters:
 *    - name: startYear
 *      in: query
 *      description: Start year of the seasons you want to fetch starting from 1950.
 *      required: true
 *      schema:
 *       type: integer
 *   responses:
 *    200:
 *     description: a List of seasons with their champion.
 */
router.post('/auth/register', asyncHandler(register));

/**
 * @swagger
 * /api/auth/login:
 *  get:
 *   summary: User login
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
router.get('/auth/login', asyncHandler(login));

export default router;