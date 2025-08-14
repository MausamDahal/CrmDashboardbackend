import { Response, NextFunction } from "express";
import { getTenantBySubdomain } from "../../infrastructure/repositories/dynamoTenantRepository";

export async function verifySubdomain(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
        const host = req.hostname;
        const mainDomain = "mausamcrm.site";

        // Allow localhost and IP addresses for development
        if (host === "localhost" || host === "127.0.0.1" || host === mainDomain || host === www.${mainDomain}) {
            // For local development, use the test tenant
            if (host === "localhost" || host === "127.0.0.1") {
                const testTenant = await getTenantBySubdomain("test");
                if (testTenant) {
                    req.tenant = testTenant;
                }
            }
            return next();
        }

        const subdomain = host.replace(.${mainDomain}, '');
        const tenant = await getTenantBySubdomain(subdomain);
        console.log(tenant)
        if (!tenant) {
            return res.status(404).json({ error: "Invalid tenant or subdomain" });
        }

        req.tenant = tenant;
        next();
    } catch (err) {
        next(err); 
    }
}