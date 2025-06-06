import { Response, NextFunction } from "express";
import { getTenantBySubdomain } from "../../infrastructure/repositories/dynamoTenantRepository";

export async function verifySubdomain(req: any, res: Response, next: NextFunction): Promise<any> {
    try {
        const host = req.hostname;
        const mainDomain = "nestcrm.com.au";

        if (host === mainDomain || host === `www.${mainDomain}`) {
            return next();
        }

        const subdomain = host.replace(`.${mainDomain}`, '');
        const tenant = await getTenantBySubdomain(subdomain);

        if (!tenant) {
            return res.status(404).json({ error: "Invalid tenant or subdomain" });
        }

        req.tenant = tenant;
        next();
    } catch (err) {
        next(err); // deixa o express lidar com o erro (e o express-async-errors também)
    }
}
