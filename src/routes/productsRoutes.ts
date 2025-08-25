import { ProductsController } from "@/controllers/ProductsController.js";
import { Router } from "express";

const productsRoutes = Router();
const productController = new ProductsController();

productsRoutes.get("/", productController.index);
productsRoutes.post("/", productController.create);
productsRoutes.put("/:id", productController.update);

export { productsRoutes };
