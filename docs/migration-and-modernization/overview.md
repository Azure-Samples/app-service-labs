---
title: Overview
description: "Move existing apps to Azure App Service and modernize legacy Windows workloads."
sidebar_position: 1
---

# Migration & Modernization

These labs cover how to move existing apps to Azure App Service and modernize
legacy Windows workloads - lifting infrastructure-dependent .NET Framework and
IIS apps into PaaS with minimal rewrites.

## Labs in this section

- **[Migrate an ASP.NET app to Managed Instance on App Service](./managed-instance.md)**
  - Move a legacy ASP.NET Framework app to a
    [Managed Instance](https://learn.microsoft.com/azure/app-service/overview-managed-instance)
    plan (preview) that keeps the managed platform while letting you customize
    the OS. Stage a configuration (install) script, create a **P1V4** plan in
    custom mode with a plan-level **managed identity**, deploy the app, and
    confirm the OS-level customization took effect.

More labs are on the way, including:

- App Service Migration Assistant for on-prem IIS / .NET Framework apps
- Containerize an existing app for App Service

For reference, see the [Migrate to App Service](https://learn.microsoft.com/azure/app-service/overview-migrate) documentation.
