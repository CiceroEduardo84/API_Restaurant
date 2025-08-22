import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { db } from "@/database/knex.js";
import { AppError } from "@/utils/AppError.js";

class ProductsController {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.query;

            const products = await db<ProductRepository>("products")
                .select()
                .whereLike("name", `%${name ?? ""}%`)
                .orderBy("name");

            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const productSchema = z.object({
                name: z.string().trim().min(10).max(50),
                price: z.number().gt(0).min(0),
            });

            const { name, price } = productSchema.parse(req.body);

            await db<ProductRepository>("products").insert({
                name,
                price,
            });

            res.status(201).json();
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = z
                .string()
                .transform((value) => Number(value))
                .refine((value) => !isNaN(value), {
                    message: "ID deve ser um numero",
                })
                .parse(req.params.id);

            const bodySchema = z.object({
                name: z.string().trim().min(10),
                price: z.number().gt(0),
            });

            const { name, price } = bodySchema.parse(req.body);

            const product = await db<ProductRepository>("products")
                .select()
                .where({ id })
                .first();

            if (!product) {
                throw new AppError("Product not found");
            }

            await db<ProductRepository>("products")
                .update({
                    name,
                    price,
                    updated_at: db.fn.now(),
                })
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
                .refine((value) => !isNaN(value), {
                    message: "ID deve ser um numero",
                })
                .parse(req.params.id);

            const product = await db<ProductRepository>("products")
                .select()
                .where({ id })
                .first();

            if (!product) {
                throw new AppError("Product not found");
            }

            await db<ProductRepository>("products")
                .delete()
                .where({ id })
                .first();

            return res.json();
        } catch (error) {
            next(error);
        }
    }
}

export { ProductsController };
