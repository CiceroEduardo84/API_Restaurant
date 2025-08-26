import { knexInstance } from "@/database/knex.js";
import { TableRepository } from "@/database/Types/tableRepository.js";
import { NextFunction, Request, Response } from "express";

class TableController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const tables = await knexInstance<TableRepository>("tables")
        .select()
        .orderBy("table_number");

      return res.json(tables);
    } catch (error) {
      next(error);
    }
  }
}

export { TableController };
