import { AppError } from "@/utils/AppError.js";
import { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    _: NextFunction
) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            message: err.message,
        });
    }

    return res.status(500).json({
        message: err.message,
    });
}
