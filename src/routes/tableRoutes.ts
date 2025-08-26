import { TableController } from "@/controllers/tablesController.js";
import { Router } from "express";

const tablesRoutes = Router();
const tableController = new TableController();

tablesRoutes.get("/", tableController.index);

export { tablesRoutes };
