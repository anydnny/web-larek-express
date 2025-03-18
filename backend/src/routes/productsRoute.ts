import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/productsControllers';
import { createProductValidator } from '../middlewares/validationHandler';

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.post('/', createProductValidator, createProduct);

export default productRouter;
