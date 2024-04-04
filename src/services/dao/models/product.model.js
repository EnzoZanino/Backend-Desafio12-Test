import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import config from "../../../config/config.js";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  status: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: Array, required: true },
  owner: { type: String, default: config.adminEmail },
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export { productModel };
