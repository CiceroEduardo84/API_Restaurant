import { Router } from "express";
import { ProductsController } from "../controllers/ProductsController.js";

const productsRoutes = Router();
const productsController = new ProductsController();

productsRoutes.get("/", productsController.index);

export { productsRoutes };
