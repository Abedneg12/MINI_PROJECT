import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

type Validatable = 'body' | 'query' | 'params';

export const validate = (
  schema: ZodTypeAny,
  property: Validatable = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[property]);
      req[property] = parsed;
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.') || '[root]',
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          message: 'Validasi gagal',
          errors: formattedErrors,
        });
      } else {
        next(error);
      }
    }
  };
};

export const validateBody = (schema: ZodTypeAny) => validate(schema, 'body');
export const validateQuery = (schema: ZodTypeAny) => validate(schema, 'query');
export const validateParams = (schema: ZodTypeAny) => validate(schema, 'params');
