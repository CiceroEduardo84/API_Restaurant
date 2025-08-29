import { knexInstance } from "@/database/knex.js";
import { TablesSessionsRepository } from "@/database/Types/tablesSessionsRepository.js";
import { AppError } from "@/utils/AppError.js";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

class TablesSessionsControler {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: z.number(),
      });

      const { table_id } = bodySchema.parse(req.body);

      const session = await knexInstance<TablesSessionsRepository>(
        "tables_session"
      )
        .where({ table_id })
        .orderBy("opened_at", "desc")
        .first();

      if (session && !session.closed_at) {
        throw new AppError("This table is already open");
      }

      await knexInstance<TablesSessionsRepository>("tables_session").insert({
        table_id,
        opened_at: knexInstance.fn.now(),
      });

      return res.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await knexInstance<TablesSessionsRepository>(
        "tables_session"
      ).orderBy("closed_at");

      return res.json(sessions);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "Id must be a number" })
        .parse(req.params.id);

      const session = await knexInstance<TablesSessionsRepository>(
        "tables_session"
      )
        .where({ id })
        .first();

      if (!session) {
        throw new AppError("Session table not found");
      }

      if (session.closed_at) {
        throw new AppError("This session table is alredy closed");
      }

      await knexInstance<TablesSessionsRepository>("tables_session")
        .update({
          closed_at: knexInstance.fn.now(),
        })
        .where({ id });

      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}

export { TablesSessionsControler };
