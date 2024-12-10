import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import { RegisterDTO, LoginDTO } from "@/types/auth.types";

const prisma = new PrismaClient();

export const register = async (req: Request<{}, {}, RegisterDTO>, res: Response) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email }});
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                user: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user'})
    }
}

export const login = async (req: Request<{}, {}, LoginDTO>, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique( {where: { email }});
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' })
    }
}