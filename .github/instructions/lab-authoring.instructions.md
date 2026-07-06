# Lab authoring instructions

> Scope: Use when creating or updating a lab under docs/**. Applies to docs/**/*.md and docs/**/*.mdx.
> This file defines the end-to-end procedure and standards for App Service Labs. It complements
> .github/copilot-instructions.md (voice, structure, Microsoft Style Guide) and
> .github/instructions/component.instructions.md (shared MDX components). When guidance overlaps,
> those files still apply; this file adds the lab-specific workflow, the Azure validation protocol,
> and the definition of done.

## What a lab is

A lab is a single, self-contained, hands-on guide that takes a learner from nothing to something
running on Azure App Service. Labs are scenario-driven and reproducible. They complement Microsoft
Learn (the reference) instead of duplicating it, and link back to the docs for depth. Aim for a lab a
learner can finish in about 75 minutes; split longer content into multiple labs.

## Where a lab lives and how to register it

- Create the lab as `docs/<category>/<kebab-case-name>.md` (or `.mdx` if it imports components).
- Categories (folder / sidebar label): getting-started (Getting Started), scenarios-and-modern-apps
  (Scenarios & Modern Apps), deployment-and-cicd (Deployment & CI/CD), configuration (Configuration),
  networking (Networking), security-and-identity (Security & Identity), scaling-and-performance
  (Scaling & Performance), monitoring-and-diagnostics (Monitoring & Diagnostics), data-and-integration
  (Data & Integration), reliability-and-operations (Reliability & Operations),
  migration-and-modernization (Migration & Modernization), advanced (Advanced).
- Add front matter with `title` and `sidebar_position` (at minimum). Add `sidebar_label` only when the
  nav label should differ from the title.
- Register the lab in that category's `overview.md` under the "Labs in this section" list, with a
  relative link and a one-line description.
- Put lab assets (screenshots, sample files) under `static/img/labs/<lab-name>/` for images, or the
  category's `assets/` folder for other files. Name asset folders after the lab file.

## Required lab structure

Author every lab with these sections, in this order:

1. Title and a short intro (what the learner builds and why).
2. Objectives - a short bulleted list of outcomes.
3. Prerequisites - use the `<Prerequisites />` shared component (it renders its own H2). Pass extra
   `tools` only for tools beyond its defaults.
4. Architecture or concept brief - a short explanation, ideally a Mermaid diagram.
5. Provision resources - use `<ProvisionResourceGroup />` and `<ProvisionResources />` when the lab
   creates Azure resources.
6. Steps - numbered, imperative, copy-paste ready. Show all tooling paths (see pivots below).
7. Verify - an explicit validation step with expected output (for example, an HTTP 200 and body).
8. Clean up - use the `<Cleanup />` shared component; make teardown unambiguous.
9. Summary - recap what the learner achieved and learned.
10. Troubleshooting - common errors, most-likely fix first, with links to official docs.
11. Learn more - links back to the relevant Microsoft Learn reference.

## Cross-cutting pivots (OS, language, tooling)

Rather than duplicate a lab per combination, cover the matrix inside one lab with Docusaurus tabs:

- OS: treat Windows and Linux as first-class; call out where behavior differs.
- Language/stack: cover .NET, Node.js, Python, Java, and PHP where relevant; other stacks via custom
  container.
- Tooling: show all three paths - Azure Developer CLI (`azd`), Azure CLI (`az`), and the Azure portal.

Rules for tabs and the PathPicker:

- Every `<Tabs>` that represents a pivot must set a `groupId` and `queryString` so selections sync
  across the page and are shareable via the URL.
- Use consistent `groupId` values across the lab (for example `tooling`, `language`, `os`).
- If the lab uses the `PathPicker` component, the picker's group ids must exactly match the inline
  `<Tabs groupId>` ids it drives.
- Pin container base images to a specific tag or digest; never use `:latest`.

## Content rules

- Write in plain ASCII only. No smart quotes, em or en dashes, ellipsis characters, or look-alike
  Unicode. Use `-` and `to` instead of dashes.
- Prefer managed identity and keyless access over stored credentials. Never embed secrets, keys,
  connection strings with secrets, or real subscription/tenant IDs. Use app settings and Key Vault
  references, and placeholder values (for example `example-resource-group`, `example-webapp`).
- State the App Service plan tier used and its rough cost implication (for example "B1 Linux, about
  USD 13/month"). Prefer the smallest tier that demonstrates the scenario.
- Use descriptive link text and relative links within the repo. Use locale-free Microsoft Learn URLs
  (for example `https://learn.microsoft.com/azure/app-service/`, not `/en-us/`).
- Follow the Microsoft Style Guide and terminology in .github/copilot-instructions.md.

## Live Azure validation protocol (required before opening a PR)

Do not ship a lab whose steps have not been run against real Azure. For each lab:

1. Run every documented tooling path (azd, az, and the portal steps) end to end on a real
   subscription.
2. Use a dedicated resource group per run, with a distinct name (for example
   `rg-asl-<lab>-<suffix>`), in a supported region, on the smallest reasonable tier.
3. Capture evidence that the scenario works - for a web app, a request returning HTTP 200 with the
   expected body; for other scenarios, the equivalent success signal.
4. Confirm the security posture the lab teaches actually holds (for example, the app pulls or calls
   with a managed identity and no keys).
5. Tear everything down and verify nothing is left running or billable:
   - Delete the resource group(s): `az group delete -n <rg> --yes --no-wait`.
   - Verify removal: `az group exists -n <rg>` returns `false`.
   - Purge soft-deleted resources where applicable (for example Azure OpenAI accounts, Key Vaults).
   - Remove any throwaway repos, local container images, and temp directories created during testing.
6. Record the validation evidence (paths tested, success signals, teardown confirmation) in the PR
   description.

## Screenshots

Screenshots are optional. When you include them:

- Capture in light mode at 1920x1080 so they are legible.
- Redact all PII before committing: emails, names, GUIDs, subscription and tenant IDs, IP addresses.
- Store under `static/img/labs/<lab-name>/` and give every image descriptive alt text.

If a screenshot cannot be captured authentically (for example, a tenant policy blocks the flow), omit
the image and rely on the text instructions. Do not ship blank or placeholder images.

## Build gate (must pass before a PR is ready)

Run from the repo root and make sure all pass:

```shell
npm install
npm run typecheck
npm run build
```

`docusaurus.config.ts` sets `onBrokenLinks: 'throw'`, so the build fails on any broken internal link.
Optionally run `npm start` to eyeball the rendered lab, tabs, and images locally.

## Quality review

Before merging, have the lab executed end to end as a first-time learner would. Use the
`lab-qa-reviewer` agent (see .github/agents/lab-qa-reviewer.agent.md) or ask another contributor to
run every step and report issues. Fix blocking issues before merge.

## Git and PR workflow

- Branch per lab, named `lab-<name>` (or `docs-<topic>` for non-lab docs changes).
- Use Conventional Commits (for example `docs(getting-started): add 'Deploy a custom container' lab`).
- Keep PRs focused on one lab or one change.
- Open the PR against `main`. Include the Azure validation evidence and confirm the build gate passed.
- Merge with squash or rebase only.

## Definition of done (checklist)

- [ ] Lab file created in the correct category with valid front matter, and registered in that
      category's overview.
- [ ] All required sections present, in order.
- [ ] Shared components used for Prerequisites, Provisioning, and Cleanup.
- [ ] Tooling, language, and OS pivots use `<Tabs>` with `groupId` + `queryString`; PathPicker ids
      match the inline tab ids.
- [ ] ASCII-clean; no `:latest` base images; no secrets or real subscription/tenant IDs; managed
      identity / keyless where possible.
- [ ] Every tooling path validated on real Azure; success signals captured.
- [ ] All test resources deleted; `az group exists` returns false; soft-deleted resources purged.
- [ ] `npm run typecheck` and `npm run build` pass.
- [ ] Lab reviewed end to end (lab-qa-reviewer agent or a human).
- [ ] PR opened against main with validation evidence; Conventional Commit title.
