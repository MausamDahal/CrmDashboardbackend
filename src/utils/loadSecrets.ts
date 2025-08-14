import {
    SecretsManagerClient,
    GetSecretValueCommand,
  } from "@aws-sdk/client-secrets-manager";
import { AIPredictionRoutes } from "../interfaces/routes/AIPredictionRoutes";
  
  const secretName = "NestCRM/Tenant-Dashboard";
  const region = "us-east-1";

let isInitialized = false;

export async function loadSecrets(): Promise<Record<string, string>> {
    if (isInitialized) return process.env as Record<string, string>;

    console.log(" Fetching secrets from AWS Secrets Manager...");

    const client = new SecretsManagerClient({ region });
    const result = await client.send(new GetSecretValueCommand({ SecretId: secretName }));

    if (!result.SecretString) {
        throw new Error("Secret string is empty.");
    }

    const secrets = JSON.parse(result.SecretString);

    // Inject secrets into process.env
    for (const key of Object.keys(secrets)) {
        process.env[key] = secrets[key];
    }

    isInitialized = true;
    console.log(" Secrets loaded into process.env");

    return secrets;
    
}