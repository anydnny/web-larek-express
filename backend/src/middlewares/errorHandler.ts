import { NextFunction, Request, Response } from 'express';
import { isCelebrateError } from 'celebrate';

interface customError extends Error {
  statusCode?: number;
}

const errorHandler = (
  error: customError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  const { statusCode = 500, message } = error;

  if (isCelebrateError(error)) {
    const errorDetails = error.details.get('body');

    if (errorDetails) {
      return res.status(400).send({ message: errorDetails.message });
    }
    return res.status(400).send({ message: 'Неизвестная ошибка валидации' });
  }
  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Произошла неизвестная ошибка' : message,
  });
};

export default errorHandler;
