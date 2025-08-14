import * as dotenv from 'dotenv';

export async function loadSecrets(): Promise<void> {
    dotenv.config();
} 