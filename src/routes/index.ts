import { Router } from "express";
import { productsRoutes } from "./productsRoutes.js";
import { tablesRoutes } from "./tableRoutes.js";

const routes = Router();

routes.use("/products", productsRoutes);
routes.use("/tables", tablesRoutes);

export { routes };
