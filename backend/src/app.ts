import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import NotFoundError from './errors/notFoundError';
import productRouter from './routes/productsRoute';
import orderRouter from './routes/orderRoute';
import errorHandler from './middlewares/errorHandler';
import { requestLogger, errorLogger } from './middlewares/loggerHandler';

dotenv.config();
const app = express();

mongoose
  .connect(process.env.DB_ADDRESS || 'mongodb://localhost:27017/weblarek')
  .then(() => console.log('Успешное подключение к БД'))
  .catch((error) => console.error('Ошибка подключения к БД:', error));

app.use(express.json());

app.use(requestLogger);

app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorLogger);
app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log(`Слушаем порт ${process.env.PORT || 3000}`));
