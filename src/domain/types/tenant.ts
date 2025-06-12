    export interface Tenant {
    ID: string;
    CompanyName: string;
    Email: string;
    Password: string;
    Subdomain: string;
    Domain: string;
    Status: 'active' | 'inactive';
    CreatedAt: string;
}
