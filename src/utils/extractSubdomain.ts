export function extractSubdomain(host: string): string {
    return host.split('.')[0];
}