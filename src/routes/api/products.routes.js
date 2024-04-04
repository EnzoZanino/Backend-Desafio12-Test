import { Router } from "express";
import {
  getProductsController,
  getProductController,
  postProductController,
  putProductController,
  deleteProductController,
  generateMockProductsController,
  getProductsFromUserController,
  getUnlimitedProductsController,
} from "../../controllers/productsControllers.js";
import { authorization } from "../../utils/auth.js";
import { passportCall } from "../../utils/passport.js";
import ErrorHandler from "../../services/errors/middlewares/index.js";

const ProductRouter = Router();

//Get mock products
ProductRouter.get("/mockingproducts", generateMockProductsController);

//Get products
ProductRouter.get(
  "/getproducts",
  passportCall("jwt"),
  authorization("admin"),
  getProductsController
);

//Get unlimited products (no pagination)
ProductRouter.get(
  "/getAllProducts",
  passportCall("jwt"),
  authorization("admin"),
  getUnlimitedProductsController
);

//Get products from Premium User
ProductRouter.get(
  "/user/:uid",
  passportCall("jwt"),
  authorization(["admin", "premium"]),
  getProductsFromUserController
);

//Get product
ProductRouter.get(
  "/product/:pid",
  passportCall("jwt"),
  authorization("admin"),
  getProductController
);

//Post product
ProductRouter.post(
  "/",
  passportCall("jwt"),
  authorization(["admin", "premium"]),
  postProductController
);

//Put product
ProductRouter.put(
  "/:pid",
  passportCall("jwt"),
  authorization(["admin", "premium"]),
  putProductController
);

//Delete product
ProductRouter.delete(
  "/:pid",
  passportCall("jwt"),
  authorization(["admin", "premium"]),
  deleteProductController
);

ProductRouter.use(ErrorHandler);

export { ProductRouter };
