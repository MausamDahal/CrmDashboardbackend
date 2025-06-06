## 🧾 NestCRM – Backend (Dashboard)

This repository contains the **backend server** for the NestCRM Dashboard – a multi-tenant, secure, and scalable API service that powers CRM operations such as customer tracking, subscription management, churn prediction, and AI-driven alerts. 

Each business (tenant) operates in **full isolation** via dynamic subdomains, token-based authentication, and dedicated DynamoDB tables. The backend is responsible for:

- Customer management
- AI prediction integrations
- Risk alert generation
- Subscription validation
- Secure API access via JWT and API keys
- Multi-tenant infrastructure enforcement

---

## Key Features

- **AI-Powered Predictions** – Integrates machine learning models to flag churn risk.
- **Multi-Tenant Security** – Isolated tables and domains per tenant.
- **Subscription Enforcement** – Stripe-integrated subscription control.
- **RESTful APIs** – Modular routes for customers, orders, support, payments, and more.
- **Cloud Native** – Designed for AWS: EC2, S3, CloudFront, Route53, DynamoDB.

---

## Tech Stack

- Node.js + Express
- TypeScript
- AWS SDK (EC2, DynamoDB, CloudFront, S3, Route53)
- JWT + API Key Authentication
- Stripe (Subscriptions)
- Python/ML backend (Separate ML service)
- GitHub Actions (CI)

---

## Getting Started (Local Dev)

### Prerequisites

- Node.js 18+
- Bun (or npm, but Bun is preferred)
- AWS credentials (IAM user with DynamoDB/EC2/S3 access)
- DynamoDB tables created for test tenant (e.g. `NestCRM-test-Customer`)
- `.env` configuration (see below)

---

### Install

```bash
cd NestCRM-Dashboard-Backend

# Install dependencies (Bun recommended)
bun install || yarn install || npm install
bun dev || yarn dev || npm run dev
