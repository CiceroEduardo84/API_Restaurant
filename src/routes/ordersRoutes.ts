import { Router } from "express";
import { OrdersController } from "@/controllers/ordersController.js";

const ordersRoutes = Router();
const ordersController = new OrdersController();

ordersRoutes.post("/", ordersController.create);
ordersRoutes.get("/table_session/:table_session_id", ordersController.index);
ordersRoutes.get("/table_session/:table_session_id/total", ordersController.show);

export { ordersRoutes };
