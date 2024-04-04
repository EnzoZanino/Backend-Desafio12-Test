import { productModel } from "./models/product.model.js";
import userModel from "./models/user.model.js";

export default class ProductService {
  async getAllProducts(limit, page, sort) {
    try {
      const options = {
        limit: parseInt(limit) || 8,
        page: parseInt(page) || 1,
      };

      if (sort !== undefined) {
        if (sort === "asc" || sort === "desc") {
          options.sort = { price: sort };
        } else {
          throw new Error("Invalid sort direction");
        }
      }

      const response = await productModel.paginate({}, options);

      return response;
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  }

  async getUnlimitedProducts() {
    try {
      const allproducts = await productModel.find();
      return allproducts;
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  }

  async getAllProductsFromUser(uId) {
    try {
      const user = await userModel.findById(uId);
      if (!user) {
        throw new Error("User not found");
      }
      const products = await productModel.find({ owner: user.email });
      return products;
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  }

  async getProductById(id) {
    let product = await productModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    } else {
      return product;
    }
  }

  async createProduct(product) {
    return await productModel.create(product);
  }

  async updateProduct(id, product) {
    return await productModel.findByIdAndUpdate(id, product, { new: true });
  }

  async deleteProduct(id) {
    return await productModel.findByIdAndDelete(id);
  }
}
