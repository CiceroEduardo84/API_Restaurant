import { knexInstance } from "@/database/knex.js";
import { OrdersRespository } from "@/database/Types/orderRepository.js";
import { ProductRepository } from "@/database/Types/productsRepository.js";
import { TablesSessionsRepository } from "@/database/Types/tablesSessionsRepository.js";
import { AppError } from "@/utils/AppError.js";
import { NextFunction, Request, Response } from "express";
import knex from "knex";
import { z } from "zod";
class OrdersController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyScheme = z.object({
        table_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number(),
      });

      const { table_session_id, product_id, quantity } = bodyScheme.parse(
        req.body
      );

      const session = await knexInstance<TablesSessionsRepository>(
        "tables_session"
      )
        .where({ id: table_session_id })
        .first();

      if (!session) {
        throw new AppError("session table not found!");
      }

      if (session.closed_at) {
        throw new AppError("This table is closed!");
      }

      const product = await knexInstance<ProductRepository>("products")
        .where({ id: product_id })
        .first();

      if (!product) {
        throw new AppError("Product not found!");
      }

      await knexInstance<OrdersRespository>("orders").insert({
        table_session_id,
        product_id,
        quantity,
        price: product.price,
      });

      return res.status(201).json({ session });
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { table_session_id } = req.params;
      const order = await knexInstance("orders")
        .select(
          "orders.id",
          "orders.table_session_id",
          "orders.product_id",
          "products.name",
          "orders.price",
          "orders.quantity",
          knexInstance.raw("(orders.price * orders.quantity) AS ToTal"),
          "orders.created_at",
          "orders.updated_at"
        )
        .join("products", "products.id", "orders.product_id")
        .where({ table_session_id })
        .orderBy("orders.created_at");

      return res.json({ order });
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { table_session_id } = req.params;

      const order = await knexInstance("orders")
        .select(
          knexInstance.raw(
            "COALESCE(SUM(orders.price * orders.quantity), 0) AS total"
          ),
          knexInstance.raw("COALESCE(SUM(orders.quantity), 0) AS quantity")
        )
        .where({ table_session_id })
        .first();

      return res.json(order);
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController };
