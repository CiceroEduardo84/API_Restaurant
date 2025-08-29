import { NextFunction, Request, Response } from "express";
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

      return res.status(201).json({});
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController };
