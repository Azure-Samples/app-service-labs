---
title: Overview
description: "Ship code to Azure App Service with confidence using GitHub Actions, deployment slots, and safe release patterns."
sidebar_position: 1
---

import UnderConstruction from '@site/src/components/UnderConstruction';

# Deployment & CI/CD

Ship code to Azure App Service with confidence. These hands-on labs cover
continuous deployment and safe release practices, following the same path three
ways (Azure Developer CLI, Azure CLI, or the Azure portal) in your language of
choice (.NET, Node.js, Python, Java, or PHP).

## Labs in this section

- **[Deploy to App Service with GitHub Actions](./deploy-with-github-actions.md)**
  - Set up continuous deployment from a GitHub repository to App Service using
  GitHub Actions, authenticating with keyless OpenID Connect (OIDC) federated
  credentials so no secrets are stored in GitHub.

- **[Use deployment slots for zero-downtime releases](./deployment-slots.md)**
  - Deploy a new version to a `staging` slot on a Standard plan, warm it up, and
  swap it into production with zero downtime. Configure sticky settings and roll
  back instantly with a swap back.

<UnderConstruction title="More labs are on the way">
  We're building more hands-on labs for this area. In the meantime, explore the official [App Service documentation](https://learn.microsoft.com/azure/app-service/).
</UnderConstruction>

When ready, this section will also cover:

- Deployment options overview (ZIP/OneDeploy, Git, run-from-package)
- Deploy with **Azure DevOps Pipelines**
- Continuous deployment for containers

For reference, see the [Continuous deployment](https://learn.microsoft.com/azure/app-service/deploy-continuous-deployment) documentation.
