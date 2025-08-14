import express, { Request, Response, NextFunction } from "express";
import cors, { CorsOptionsDelegate } from "cors";
import cookieParser from "cookie-parser";
import 'express-async-errors';
import { Tenant } from './domain/types/tenant';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import { verifySubdomain } from "./interfaces/middleware/verifySubdomain";
import { verifyToken } from "./interfaces/middleware/verifyToken";
import { customFieldRoutes } from "./interfaces/routes/customFieldRoutes";
import { customerRoutes } from "./interfaces/routes/customerRoutes";
import { orderRoutes } from "./interfaces/routes/orderRoutes";
import { paymentRoutes } from "./interfaces/routes/paymentRoutes";
import { supportRoutes } from "./interfaces/routes/supportRoutes";
import { interactionRoutes } from "./interfaces/routes/interactionRoutes";
import riskAlertRoutes from "./interfaces/routes/riskAlertRoutes";
import { AIPredictionRoutes } from "./interfaces/routes/AIPredictionRoutes";
import { enforceOriginOrApiKey } from "./interfaces/middleware/enforceOriginOrApiKey";
import { apiKeyRoutes } from "./interfaces/routes/apiKeyRoutes";
import { subscriptionRoutes } from "./interfaces/routes/subscriptionRoutes";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      tenant?: Tenant;
      user?: any;
    }
  }
}

const app = express();

const allowedOrigins: (string | RegExp)[] = [
    /\.nestcrm\.com\.au$/,
    'https://mausamcrm.site',
    'https://www.mausamcrm.site',
    /^https:\/\/([a-zA-Z0-9-]+)\.mausamcrm\.site$/,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:4000',
    'http://127.0.0.1:5173',
    'http://localhost:8080'
];

const corsOptions: CorsOptionsDelegate = (req, callback) => {
    const origin = req.headers.origin as string | undefined;
    const isAllowed = !origin || allowedOrigins.some(o =>
        typeof o === 'string' ? o === origin : o.test(origin)
    );
    callback(isAllowed ? null : new Error('Not allowed by CORS'), {
        origin: isAllowed,
        credentials: true,
    });
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Test route to verify routing is working
app.get('/test', (_req: Request, res: Response) => {
    res.json({ message: 'Test route is working' });
});

// Login routes (both GET and POST for testing)
app.get('/api/login', (req: Request, res: Response) => {
    console.log('Login route hit'); // Debug log
    const token = jwt.sign(
        { 
            subdomain: 'test',
            email: 'test@example.com',
            role: 'admin'
        },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '24h' }
    );

    res.setHeader("Set-Cookie", [
        `token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Domain=.mausamcrm.site`,
    ]);
    
    res.status(200).json({ message: 'Logged in successfully' });
});

app.post('/api/login', (req: Request, res: Response) => {
    console.log('Login route hit'); // Debug log
    const token = jwt.sign(
        { 
            subdomain: 'test',
            email: 'test@example.com',
            role: 'admin'
        },
        process.env.JWT_SECRET || 'dev-secret',
        { expiresIn: '24h' }
    );

    res.setHeader("Set-Cookie", [
        `token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Domain=.mausamcrm.site`,
    ]);
    
    res.status(200).json({ message: 'Logged in successfully' });
});

// Logout route
app.post('/api/logout', (req: Request, res: Response) => {
    res.setHeader("Set-Cookie", [
        `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None; Domain=.mausamcrm.site`,
    ]);
    res.status(200).json({ message: 'Logged out successfully' });
});

// Protected routes
app.use('/', verifySubdomain);
app.use("/api/subscription", verifyToken, enforceOriginOrApiKey, subscriptionRoutes);
app.use("/api/api-key", verifyToken, apiKeyRoutes);
app.use('/api/risk', verifyToken, riskAlertRoutes);
app.use("/api/settings", verifyToken, customFieldRoutes);
app.use("/api/ai", verifyToken, AIPredictionRoutes);
app.use("/api/customer", verifySubdomain, enforceOriginOrApiKey, customerRoutes);
app.use("/api/order", verifyToken, orderRoutes);
app.use("/api/payment", verifyToken, paymentRoutes);
app.use("/api/support", verifyToken, supportRoutes);
app.use("/api/interaction", verifyToken, interactionRoutes);
app.get('/api/status', verifyToken, (_req: Request, res: Response) => {
    res.status(200).json({ message: ' API is working fine!' });
});

// 404 handler
// app.use((_req: Request, res: Response) => {
//     res.status(404).json({ error: 'Not Found' });
// });

app.listen(3000, '0.0.0.0', () => {
    console.log(' Backend API server running on port 3000');
});
