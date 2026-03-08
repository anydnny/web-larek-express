import { Schema, model } from 'mongoose';

interface IProductImage {
  fileName: string;
  originalName: string;
}

interface IProduct {
  title: string;
  image: IProductImage;
  category: string;
  description: string;
  price: number | null;
}

const productImageSchema = new Schema<IProductImage>({
  fileName: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
});

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
  },
  image: {
    type: productImageSchema,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    default: null,
  },
});

export default model<IProduct>('product', productSchema);
