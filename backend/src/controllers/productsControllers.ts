import { Request, Response, NextFunction } from 'express';
import product from '../models/productSchema';
import BadRequestError from '../errors/badRequestErr';
import BaseError from '../errors/baseError';
import DuplicateTitleError from '../errors/duplicateTitleError';

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await product.find({});
    return res.status(200).send({ products, total: products.length });
  } catch (error) {
    return next(new BaseError('Произошла ошибка'));
  }
};

export const createProduct = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      description, image, title, category, price,
    } = _req.body;

    const newProduct = await product.create({
      description,
      image,
      title,
      category,
      price,
    });

    return res.status(201).send({ product: newProduct });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return next(new BadRequestError('Ошибка валидации'));
    } if (error instanceof Error && error.message.includes('E11000')) {
      return next(
        new DuplicateTitleError('Товар с таким title уже существует'),
      );
    }

    return next(error);
  }
};
