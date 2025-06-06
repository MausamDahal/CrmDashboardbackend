import express, { Request, Response, NextFunction } from "express";
import cors, { CorsOptionsDelegate } from "cors";
import cookieParser from "cookie-parser";
import 'express-async-errors';
import { Tenant } from './domain/types/tenant';

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

const allowedOrigins: (string | RegExp)[] = [/\.nestcrm\.com\.au$/, 'https://nestcrm.com.au', 'https://www.nestcrm.com.au', 'https://*.nestcrm.com.au'];
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

// 👇 Public routes (no subdomain check)
app.post('/api/logout', (req: Request, res: Response) => {
  res.setHeader("Set-Cookie", [
    `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None`,
  ]);
  res.status(200).json({ message: 'Logged out successfully' });
});

// 👇 All tenant-protected routes
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
  res.status(200).json({ message: '🟢 API is working fine!' });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('✅ Backend API server running on port 3000');
});
