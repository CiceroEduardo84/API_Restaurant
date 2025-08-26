import { knexInstance } from "@/database/knex.js";
import { ProductRepository } from "@/database/Types/products_repository.js";
import { AppError } from "@/utils/AppError.js";
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
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "id must be a number" })
        .parse(req.params.id);

      const bodySchema = z.object({
        name: z.string().trim().min(5),
        price: z.number().gt(0, { message: "value must be greater than 0" }),
      });

      const { name, price } = bodySchema.parse(req.body);

      const product = await knexInstance<ProductRepository>("products")
        .select()
        .where({ id })
        .first();

      if (!product) {
        throw new AppError("Product not found!");
      }

      await knexInstance<ProductRepository>("products")
        .update({ name, price, updated_at: knexInstance.fn.now() })
        .where({ id });

      return res.json();
    } catch (error) {
      next(error);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), { message: "id must be a number" })
        .parse(req.params.id);

      const product = await knexInstance<ProductRepository>("products")
        .select()
        .where({ id })
        .first();

      if (!product) {
        throw new AppError("Product not found!");
      }

      await knexInstance<ProductRepository>("products").delete().where({ id });
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsController };
