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
    res.status(200).send({ products, total: products.length });
  } catch (error) {
    next(new BaseError('Произзошла ошибка'));
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

    if (!title || !image || !category) {
      next(new BadRequestError('Поля image, title, category обязательные'));
    }

    const checkProduct = await product.findOne({ title });

    if (checkProduct) {
      next(new DuplicateTitleError('Товар с таким title уже существует'));
    }

    const newProduct = await product.create({
      description,
      image,
      title,
      category,
      price,
    });

    res.status(201).send({ product: newProduct });
  } catch (error) {
    next(error);
  }
};
