---
title: Overview
description: "Our flagship track: scenario-driven labs that build and run modern apps on Azure App Service."
sidebar_position: 1
---

# Scenarios & modern apps

This is our flagship track. Rather than mirror the reference docs, these labs
walk through complete, modern scenarios end-to-end - many drawn from the latest
[Apps on Azure blog](https://azure.github.io/AppService/).

## Labs in this section

- **[Host an MCP server on App Service, secured with OAuth](./host-an-mcp-server.md)** -
  Build a stateless [Model Context Protocol](https://modelcontextprotocol.io/)
  server (Node.js or Python), deploy it to App Service three ways (azd, Azure
  CLI, or the portal), and secure it with OAuth 2.0 / Microsoft Entra ID using
  Easy Auth so AI agents like GitHub Copilot can call it safely.

- **[Build and deploy an AI-powered app](./deploy-an-ai-app.md)** -
  Build a web app (Python or Node.js) that calls an
  [Azure OpenAI](https://learn.microsoft.com/azure/ai-services/openai/overview)
  `gpt-4o` model, deploy it to App Service three ways (azd, Azure CLI, or the
  portal), and reach Azure OpenAI with a **managed identity** so there are no
  API keys in your code or configuration.

More scenario labs are on the way, including:

- Scale stateless MCP and API workloads
- Use **API Management as an AI/tool gateway** in front of App Service
- Add authentication to an API end-to-end with **Easy Auth**
