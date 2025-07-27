import { Request, Response } from 'express';
import { registerUser } from '../../../services/auth/auth.service';


export const register = async (
  req: Request,
  res: Response
) => {
  await registerUser();
};

export const login = async (
  req: Request,
  res: Response
) => {
  
};
