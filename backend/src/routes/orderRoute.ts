import { Router } from 'express';
import createOrder from '../controllers/orderController';
import { createOrderValidator } from '../middlewares/validationHandler';

const orderRouter = Router();
orderRouter.post('/', createOrderValidator, createOrder);
export default orderRouter;
