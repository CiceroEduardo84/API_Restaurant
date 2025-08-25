import { knexInstance } from "@/database/knex.js";
import { ProductRepository } from "@/database/Types/products_repository.js";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

class ProductsController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.query;
      const products = await knexInstance<ProductRepository>("products")
        .select()
        .whereLike("name", `%${name ?? ""}%`)
        .orderBy("name");

      return res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(5),
        price: z.number().gt(0, { message: "value must be greater than 0" }),
      });

      const { name, price } = bodySchema.parse(req.body);

      await knexInstance<ProductRepository>("products").insert({ name, price });

      return res.status(200).json({ name, price });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      return res.json({ message: "upadate" });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsController };
