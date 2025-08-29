import { Router } from "express";
import { productsRoutes } from "./productsRoutes.js";
import { tablesRoutes } from "./tableRoutes.js";
import { tablesSessionsRouter } from "./tablesSessionsRoutes.js";
import { ordersRoutes } from "./ordersRoutes.js";

const routes = Router();

routes.use("/products", productsRoutes);
routes.use("/tables", tablesRoutes);
routes.use("/tables_sessions", tablesSessionsRouter);
routes.use("/orders", ordersRoutes);

export { routes };
