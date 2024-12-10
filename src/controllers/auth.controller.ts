import { RequestHandler } from "express";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
import { RegisterDTO, LoginDTO } from "@/types/auth.types";

const prisma = new PrismaClient();

export const register: RequestHandler<{}, any, RegisterDTO> = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email }});
        if (existingUser) {
            res.status(400).json({ message: 'Email already registered' });
            return;
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

export const login: RequestHandler<{}, any, LoginDTO> = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique( {where: { email }});
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
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