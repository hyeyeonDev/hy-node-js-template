import { Request, Response, NextFunction } from 'express';

export const enrichRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[LOG] ${req.method} ${req.url}`);
  next();
};

export const attachDbName = (schema: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    (req as any).schema = schema;
    next();
  };
};

export const error404 = (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
};

export const error500 = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Internal Server Error' });
};
