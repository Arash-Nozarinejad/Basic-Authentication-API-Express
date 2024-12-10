import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: number;
            email: string;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id},
            select: {id: true, email: true}
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json( { message: 'Invalid token' });
    }
}