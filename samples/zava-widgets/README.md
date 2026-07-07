# Zava Widgets

A small Node.js (Express) product-catalog web app used by the **From first deploy
to enterprise-grade on Azure App Service** learning path.

The app is deliberately simple, but every capability the labs add is gated behind
an **app setting** (environment variable). That lets the *same* app grow from a
plain first deploy into an enterprise-grade app, one lab at a time, without
rewriting the code.

| Capability | App setting(s) | Added in |
| :-- | :-- | :-- |
| Serve the catalog | (none - in-memory seed) | Step 1: Deploy |
| Personalize the storefront | `CATALOG_TITLE`, `WELCOME_MESSAGE` | Step 2: Configuration |
| Read the catalog from a database | `AZURE_SQL_SERVER`, `AZURE_SQL_DATABASE` | Step 3: Database + managed identity |
| Partner integration key | `PARTNER_API_KEY` (later a Key Vault reference) | Later step |

## Run locally

```bash
cd src
npm install
npm start
# open http://localhost:3000
```

## Deploy with the Azure Developer CLI

```bash
azd up
```

`azd` provisions the resources in `infra/` (a Linux App Service plan and a web app
with a system-assigned managed identity) and deploys the app in `src/`.

## Endpoints

| Path | Purpose |
| :-- | :-- |
| `/` | HTML storefront |
| `/api/products` | Catalog as JSON (shows the data source) |
| `/api/info` | Current configuration and data source - handy for verifying each lab step |
| `/health` | Health probe used by a later reliability lab |

## Data source

When `AZURE_SQL_SERVER` and `AZURE_SQL_DATABASE` are set, the app reads products
from Azure SQL using `azure-active-directory-default` authentication - that is,
the app's **managed identity**. No SQL password is stored anywhere. When those
settings are absent, the app serves the in-memory seed catalog in
`src/data/products.js`.
