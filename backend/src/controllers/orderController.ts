import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';

import product from '../models/productSchema';
import BadRequestError from '../errors/badRequestErr';

const createOrder = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { total, items } = _req.body;
  const genId = faker.string.uuid();

  try {
    const products = await product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError('Один или несколько товаров не найдены'));
    }

    const hasInvalidProduct = products.some((item) => {
      if (!item.price) {
        next(new BadRequestError(`Товар ${item.title} не продаётся`));
        return true;
      }
      return false;
    });

    if (hasInvalidProduct) {
      return false;
    }

    const totalSum = products.reduce(
      (totalPrice, item) => totalPrice + (item.price || 0),
      0,
    );

    if (totalSum !== total) {
      return next(new BadRequestError('Сумма заказа не совпадает'));
    }

    return res.status(201).send({ id: genId, total: totalSum });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка валидации'));
    }
    return next(error);
  }
};
export default createOrder;
