import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getTenantBySubdomain } from "../../infrastructure/repositories/dynamoTenantRepository";
import { DynamoApiKeyRepository } from "../../infrastructure/repositories/dynamoApiKeyRepository";

const apiKeyRepo = new DynamoApiKeyRepository();

export async function enforceOriginOrApiKey(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        const host = req.hostname;
        const subdomain = host.split('.')[0];
        const origin = req.headers.origin || req.headers.referer || '';
        const token = req.cookies?.token;
        const apiKey = (req.headers['x-api-key'] || req.headers['authorization']?.replace(/^Bearer\s+/i, '') || '').trim();

        const expectedOriginPrefix = https://${subdomain}mausamcrm.site;
        const fromFrontend = origin.startsWith(expectedOriginPrefix);

        // Case 1: Frontend request with JWT token
        if (fromFrontend && token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            const subdomainFromToken = decoded.subdomain;
            if (subdomainFromToken !== subdomain) {
                res.status(403).json({ error: 'Subdomain mismatch in token' });
                return;
            }
            req.user = decoded;
            return next();
        }

        // Case 2: External request → require API key
        // if (!apiKey) {
        //     res.status(401).json({ error: "Missing API key or invalid origin" });
        //     return;
        // }

        const tenant = await getTenantBySubdomain(subdomain);
        if (!tenant) {
            res.status(404).json({ error: "Tenant not found" });
            return;
        }

        // const hashed = crypto.createHash("sha256").update(apiKey).digest("hex");
        // const record = await apiKeyRepo.getByHashedKey(subdomain, hashed);
        // if (!record || !record.active) {
        //     res.status(403).json({ error: "Invalid or inactive API key" });
        //     return;
        // }

        req.tenant = tenant;
        next();
    } catch (err) {
        console.error("Error in enforceOriginOrApiKey:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}