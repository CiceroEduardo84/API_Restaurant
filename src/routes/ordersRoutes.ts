import { Router } from "express";
import { OrdersController } from "@/controllers/ordersController.js";

const ordersRoutes = Router();
const ordersController = new OrdersController();

ordersRoutes.post("/", ordersController.create);

export { ordersRoutes };
