import  request  from "supertest";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import express from 'express';
import authRoutes from '../routes/auth.routes';

const app = express()
app.use(express.json());
app.use('/api/auth', authRoutes);

const prisma = new PrismaClient();

beforeAll(async () => {
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

describe('Authentication API', () => {
    const testUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
    };

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('email', testUser.email);
        });

        it('should not register duplicate email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser);

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('Should login existing user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email, password: testUser.password
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should reject invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email, password: 'wrongPassword'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/auth/me', () => {
        it('should get authenticated user profile', async () => {
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: testUser.email, password: testUser.password
                });
            
                const response = await request(app)
                    .get('/api/auth/me')
                    .set('Authorization', `Bearer ${loginResponse.body.token}`);

                expect(response.status).toBe(200);
                expect(response.body.user).toHaveProperty('email', testUser.email);
        });

        it('should reject unauthenticated request', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
        });
    });
});