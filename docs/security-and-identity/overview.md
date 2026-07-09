---
title: Overview
description: "Secure App Service apps and connect to Azure services with managed identity, Key Vault, and Entra ID."
sidebar_position: 1
---

# Security & Identity

These labs cover how to secure App Service apps and connect to other Azure
services without storing credentials - using managed identity, Key Vault
references, and Microsoft Entra ID.

## Labs in this section

- **[Reference Key Vault secrets from App Service](./key-vault-references.md)**
  - Store a secret in [Azure Key Vault](https://learn.microsoft.com/azure/key-vault/general/overview),
    point an app setting at it with a Key Vault reference, and let App Service
    resolve it at runtime using the app's **managed identity** - so there are no
    secrets in your code or configuration.

More labs are on the way, including:

- Authentication and authorization (Easy Auth) with Microsoft Entra ID
- Connect to Azure services with managed identity

For reference, see the [App Service security](https://learn.microsoft.com/azure/app-service/overview-security) documentation.
