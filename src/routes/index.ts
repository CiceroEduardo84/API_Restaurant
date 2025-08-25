import { Router } from "express";
import { productsRoutes } from "./productsRoutes.js";

const routes = Router();

routes.use("/products", productsRoutes);

export { routes };
