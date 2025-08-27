import { TablesSessionsControler } from "@/controllers/tablesSessionController.js";
import { Router } from "express";

const tablesSessionsRouter = Router();
const tablesSessionsControler = new TablesSessionsControler();

tablesSessionsRouter.get("/", tablesSessionsControler.index);
tablesSessionsRouter.post("/", tablesSessionsControler.create);
tablesSessionsRouter.patch("/:id", tablesSessionsControler.update);

export { tablesSessionsRouter };
