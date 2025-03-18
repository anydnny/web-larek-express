import { Joi, celebrate, Segments } from 'celebrate';

export const createProductValidate = Joi.object().keys({
  title: Joi.string().required().min(2).max(30)
    .messages({
      'any.required': 'Поле "title" обязательно',
      'string.empty': 'Поле "title" не может быть пустым',
      'string.min': 'Минимальная длина "title": 2',
      'string.max': 'Максимальная длина "title": 30',
    }),
  image: Joi.object()
    .keys({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    })
    .required().messages({
      'any.required': 'Поле "image" обязательно',
    }),
  category: Joi.string().required().messages({
    'any.required': 'Поле "category" обязательно',
  }),
  description: Joi.string().allow(null, ''),
  price: Joi.number().allow(null),
});

export const createOrderValidate = Joi.object().keys({
  payment: Joi.string().required().valid('card', 'online').messages({
    'any.required': 'Поле "payment" обязательно',
    'any.only': 'Поле "payment" должно иметь значение card или online',
    'string.empty': 'Поле "payment" не может быть пустым',
  }),
  email: Joi.string().required().email().messages({
    'any.required': 'Поле "email" обязательно',
    'string.email': 'Поле "email" имеет неверный формат',
    'string.empty': 'Поле "email" не может быть пустым',
  }),
  phone: Joi.string().required().messages({
    'any.required': 'Поле "phone" обязательно',
    'string.empty': 'Поле "phone" не может быть пустым',
  }),
  address: Joi.string().required().messages({
    'any.required': 'Поле "address" обязательно',
    'string.empty': 'Поле "address" не может быть пустым',
  }),
  total: Joi.number().required().messages({
    'any.required': 'Поле "total" обязательно',
  }),
  items: Joi.array().items(Joi.string().length(24)).required().min(1)
    .messages({
      'any.required': 'Поле "items" обязательно',
      'array.min': 'Должен быть как минимум один товар',
      'string.length': 'ID товара должен иметь длину 24 символа',
    }),
});

export const createProductValidator = celebrate({
  [Segments.BODY]: createProductValidate,
});

export const createOrderValidator = celebrate({
  [Segments.BODY]: createOrderValidate,
});
