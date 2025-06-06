import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';


export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: 'Token missing in cookie' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const subdomainFromToken = decoded.subdomain;
        const subdomainFromRequest = req.hostname.split('.')[0];

        if (subdomainFromToken !== subdomainFromRequest) {
            return res.status(403).json({ error: 'Subdomain mismatch' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token validation error', err);
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

