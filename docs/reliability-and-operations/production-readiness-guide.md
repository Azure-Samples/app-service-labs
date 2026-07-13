---
title: App Service production-readiness guide
description: "Use this checklist to prepare an Azure App Service app for reliable, secure, observable production operation."
sidebar_position: 2
---

# App Service production-readiness guide

Use this guide as a release gate for an app on Azure App Service. It does not
replace architecture review, threat modeling, load testing, or a recovery
exercise. It gives your team one place to check the App Service capabilities
that most production workloads need and links to hands-on labs where you can
practice them.

The right configuration depends on your service-level objectives, data
classification, traffic pattern, and recovery requirements. Record each
decision, including why a capability is not required.

## 1. Define the production target

- [ ] Document availability, latency, and recovery objectives.
- [ ] Choose regions that support the features and capacity you need.
- [ ] Select an App Service plan tier from measured CPU, memory, and request
      behavior, not only from the lowest price.
- [ ] Use at least two instances for workloads that must remain available
      during instance maintenance or an unhealthy instance.
- [ ] Confirm subscription quotas and regional capacity before the release.
- [ ] Estimate App Service, monitoring, networking, backup, and security costs.

Start with the [reliability guidance for App Service](https://learn.microsoft.com/azure/reliability/reliability-app-service)
and the [App Service plan overview](https://learn.microsoft.com/azure/app-service/overview-hosting-plans).
For a business-critical zonal design, review whether your region and plan
support [availability-zone redundancy](https://learn.microsoft.com/azure/reliability/reliability-app-service#availability-zone-support).

## 2. Make deployment repeatable

- [ ] Define the app, plan, settings, identities, monitoring, and network
      dependencies as infrastructure as code.
- [ ] Keep environment-specific values outside source code.
- [ ] Deploy through a reviewed CI/CD workflow with keyless Azure
      authentication.
- [ ] Disable basic authentication for SCM and FTP when your deployment method
      does not require it.
- [ ] Pin runtime and container versions. Never deploy a `latest` container tag.
- [ ] Preserve a tested rollback path.

Practice the foundations in these labs:

- [Deploy your first web app](../getting-started/deploy-your-first-web-app.md)
- [Deploy a custom container with managed identity](../getting-started/deploy-a-custom-container.md)
- [Deploy with GitHub Actions and OIDC](../deployment-and-cicd/deploy-with-github-actions.md)
- [Release with deployment slots](../deployment-and-cicd/deployment-slots.md)

The [enterprise web app learning path](../learning-paths/enterprise-web-app/overview.mdx)
also carries one app through configuration, slots, monitoring, identity, and
private networking. Use its individual steps as examples without treating this
checklist as another learning path.

## 3. Separate configuration from code

- [ ] Store nonsecret environment values in app settings.
- [ ] Store secrets in Azure Key Vault and resolve them through managed identity.
- [ ] Mark environment-specific deployment-slot settings as sticky.
- [ ] Set a supported runtime version and an explicit startup command when the
      runtime needs one.
- [ ] Configure Always On where the workload must not unload while idle.
- [ ] Apply configuration changes through a repeatable deployment and verify
      the resulting app settings.

Use the [externalize configuration](../learning-paths/enterprise-web-app/externalize-configuration.md)
step and the [Key Vault references lab](../security-and-identity/key-vault-references.md)
for hands-on practice.

## 4. Secure every ingress path

- [ ] Map production hostnames with a takeover-resistant DNS validation record.
- [ ] Bind a trusted certificate to every custom hostname.
- [ ] Enable HTTPS-only and set the minimum TLS version to 1.2 or higher for the
      app and SCM endpoint.
- [ ] Add authentication and authorization before the app when anonymous access
      is not required.
- [ ] Restrict public access or place a web application firewall in front of
      internet-facing apps when the threat model requires it.
- [ ] Confirm the app uses the expected host header and redirect behavior.

Complete [Secure a custom domain with a managed certificate](../configuration/secure-custom-domain-managed-certificate.mdx)
for the DNS, certificate, HTTPS-only, and TLS workflow. For sign-in, use the
[require sign-in](../learning-paths/enterprise-web-app/require-sign-in.md) step.

## 5. Use identities, not credentials

- [ ] Give the app a managed identity for outbound Azure access.
- [ ] Grant only the data-plane roles the app needs at the narrowest practical
      scope.
- [ ] Use workload identity federation for CI/CD.
- [ ] Remove connection strings, client secrets, publish profiles, and access
      keys that keyless paths replaced.
- [ ] Separate management-plane access from application data-plane access.
- [ ] Review role assignments and unused identities regularly.

The [Key Vault references lab](../security-and-identity/key-vault-references.md)
and [GitHub Actions lab](../deployment-and-cicd/deploy-with-github-actions.md)
demonstrate keyless patterns.

## 6. Observe the app before users do

- [ ] Connect a workspace-based Application Insights resource.
- [ ] Confirm requests, dependencies, exceptions, and traces arrive.
- [ ] Configure App Service platform diagnostic logs to a retained destination.
- [ ] Add high-signal alerts for availability, failed requests, latency, and
      resource saturation.
- [ ] Create a Standard availability test from multiple locations.
- [ ] Put dashboards, KQL queries, alert ownership, and escalation instructions
      in the operations runbook.
- [ ] Verify telemetry does not collect secrets or unnecessary personal data.

Use [Monitor your app with Application Insights](../monitoring-and-diagnostics/application-insights.md)
to work with Live Metrics, KQL, availability tests, and slow-request diagnosis.
The [add monitoring](../learning-paths/enterprise-web-app/add-monitoring.md) step
shows the same foundation in the enterprise scenario.

## 7. Detect and respond to security risk

- [ ] Review Defender for Cloud recommendations and assign remediation owners.
- [ ] Decide whether the subscription-wide Defender for App Service plan is
      justified for the workload and budget.
- [ ] Route the App Service logs needed for investigation to a protected
      destination.
- [ ] Define alert triage, containment, evidence preservation, and escalation
      procedures.
- [ ] Review Azure Activity Log and role changes as part of an incident.

The advanced [Microsoft Defender for App Service lab](../security-and-identity/microsoft-defender-for-app-service.mdx)
explains the subscription scope and cost before enablement, then shows safe
verification and precise rollback.

## 8. Detect and replace unhealthy instances

- [ ] Expose a lightweight health endpoint that checks only dependencies needed
      to serve traffic.
- [ ] Configure App Service health check to use that endpoint.
- [ ] Return a non-2xx response when the instance should leave load-balancer
      rotation.
- [ ] Run at least two instances if health check must preserve availability.
- [ ] Keep the health endpoint fast, deterministic, and free of sensitive data.

Follow [Add health checks and Always On](../learning-paths/enterprise-web-app/add-health-checks.md)
to configure and verify the platform probe.

## 9. Scale from evidence

- [ ] Load test a production-like environment.
- [ ] Set a safe minimum instance count before enabling autoscale.
- [ ] Choose scale signals that represent real constraints, and configure both
      scale-out and scale-in rules.
- [ ] Allow enough cooldown time to prevent oscillation.
- [ ] Confirm every app sharing the plan can scale together.
- [ ] Recheck database, network, and downstream service limits at peak scale.

Practice tier selection and rules in [Scale your app up and out with autoscale](../scaling-and-performance/autoscale.md).

## 10. Isolate network traffic deliberately

- [ ] Decide whether inbound traffic should be public, restricted, fronted by a
      gateway, or private.
- [ ] Use VNet integration for outbound access to private dependencies.
- [ ] Use private endpoints and private DNS for supported back-end services.
- [ ] Disable public access only after private name resolution and connectivity
      are verified.
- [ ] Plan outbound addresses, DNS, network security rules, and route tables.

The [private networking](../learning-paths/enterprise-web-app/private-networking.md)
step demonstrates VNet integration, a private endpoint, private DNS, and public
access removal.

## 11. Rehearse release and rollback

- [ ] Deploy to a staging slot and validate it before a production swap.
- [ ] Mark settings that must stay with each environment as deployment-slot
      settings.
- [ ] Configure a warm-up and health path that represents readiness.
- [ ] Watch availability, failures, and latency during and after the release.
- [ ] Define an automatic or operator-driven rollback threshold.
- [ ] Practice swapping back before relying on the procedure.

Use [deployment slots for zero-downtime releases](../deployment-and-cicd/deployment-slots.md)
for a complete deploy, warm-up, swap, and swap-back exercise.

## 12. Back up data and test recovery

- [ ] Identify which state lives in the app, mounted storage, and external data
      services.
- [ ] Configure backups only for the content and configuration App Service can
      protect.
- [ ] Protect databases and other state with their service-specific backup
      capabilities.
- [ ] Set retention and access controls from recovery and compliance objectives.
- [ ] Restore into a safe target and verify the app and data.
- [ ] Document regional failover separately from backup restore.

A standalone backup lab is not yet available in this repository. Follow the
official [App Service backup and restore guide](https://learn.microsoft.com/azure/app-service/manage-backup)
and test a restore before production launch.

## Release decision

Do not treat unchecked items as automatic failures. For each exception, record:

1. The requirement or risk.
2. The owner who accepted it.
3. The compensating control.
4. The date to review the decision.

After the release, revisit this checklist after major architecture changes,
security incidents, capacity events, and recovery exercises.

## Learn more

- [Azure Well-Architected Framework](https://learn.microsoft.com/azure/well-architected/)
- [Reliability in Azure App Service](https://learn.microsoft.com/azure/reliability/reliability-app-service)
- [Secure your App Service deployment](https://learn.microsoft.com/azure/app-service/overview-security)
- [Monitor App Service](https://learn.microsoft.com/azure/app-service/web-sites-monitor)
- [App Service networking features](https://learn.microsoft.com/azure/app-service/networking-features)
