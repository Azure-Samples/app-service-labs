---
title: "Step 2: Observe the agents"
sidebar_position: 3
---

import PathNav from '@site/src/components/LearningPath/PathNav';

# Step 2: Observe the agents

This is the second step of the
[Govern multi-agent AI learning path](/docs/learning-paths/govern-multi-agent-ai).
Your travel planner is running, but a multi-agent workflow is a black box until you
can see inside it. In this step you open the Application Insights **Agents
(Preview)** view and watch every agent, token, and tool call - **without changing
any code**. The app you deployed in Step 1 already emits the right telemetry.

In this step you will:

- Generate agent activity by submitting a few travel plans.
- Open the **Agents (Preview)** view in Application Insights.
- Filter by agent, compare token usage, and drill into an end-to-end transaction.

**Estimated time:** 20 to 30 minutes.

## Objectives

By the end of this step you will be able to:

- Explain how OpenTelemetry GenAI semantic conventions power the Agents view.
- Identify which agent spends the most tokens in a workflow.
- Trace a single travel plan from request to final itinerary across all six agents.

## Why there is nothing to add

The sample is already fully instrumented, so this step is about **reading**
telemetry, not writing it. It helps to know where that telemetry comes from,
because the same signals power the governance audit trail in Step 3.

The app instruments at two layers:

- **LLM layer** - `Microsoft.Extensions.AI` wraps the chat client with
  `.UseOpenTelemetry()`. Every model call emits spans with `gen_ai.request.model`,
  `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, and
  `gen_ai.operation.name` (`chat` or `execute_tool`).
- **Agent layer** - the Microsoft Agent Framework wraps each agent with
  `.UseOpenTelemetry(sourceName: AgentName)`. This emits `gen_ai.agent.name`,
  `gen_ai.agent.description`, and `gen_ai.agent.id` - the identity that powers the
  agent dropdown and per-agent filtering.

Those spans reach Application Insights because the API calls
`AddOpenTelemetry().UseAzureMonitor()` and the WebJob configures the Azure Monitor
exporters directly. Both auto-discover the `APPLICATIONINSIGHTS_CONNECTION_STRING`
app setting that `azd up` wired in - no connection strings in code.

:::info No portal wiring needed
Because instrumentation and the Application Insights resource were provisioned in
Step 1, the Agents view lights up on its own. If it looks empty, you have not sent
traffic yet - generate some below.
:::

## Generate some activity

The Agents view only shows data once agents have run. Submit two or three travel
plans with different destinations so there is something to compare. Use the web
form from Step 1, or the command line:

```bash
APP_URL=$(azd env get-values | grep SERVICE_API_URI | cut -d'"' -f2)

for CITY in "Tokyo, Japan" "Lisbon, Portugal" "Reykjavik, Iceland"; do
  curl -s -X POST "$APP_URL/api/travel-plans" \
    -H "Content-Type: application/json" \
    -d "{\"destination\":\"$CITY\",\"startDate\":\"2025-10-10\",\"endDate\":\"2025-10-14\",\"budget\":2500,\"interests\":[\"food\",\"history\"],\"travelStyle\":\"balanced\"}" \
    -o /dev/null -w "Submitted $CITY\n"
done
```

Give the WebJob a minute or two to finish processing, then explore the telemetry.
Telemetry can take a few minutes to appear in Application Insights.

## Step 1: Open the Agents view

In the [Azure portal](https://portal.azure.com), open the **Application Insights**
resource `azd` created (its name is the `APPLICATIONINSIGHTS_NAME` value from
Step 1). In the left menu, under **Investigations**, select **Agents (Preview)**.
This opens the unified agent-monitoring dashboard.

## Step 2: Filter by agent

The **agent dropdown** at the top is populated by the `gen_ai.agent.name` values in
your telemetry. You will see all six agents:

- Travel Planning Coordinator
- Currency Conversion Specialist
- Weather & Packing Advisor
- Local Expert & Cultural Guide
- Itinerary Planning Expert
- Budget Optimization Specialist

Select one agent to filter the whole dashboard - token usage, latency, and error
rate - down to that agent.

## Step 3: Compare token usage

The token-usage tile shows total input and output tokens over the selected time
range. Compare agents to find your biggest spenders. The **Coordinator** usually
uses the most output tokens because it synthesizes the results from the other five
specialists into the final plan. This is exactly the kind of insight you use to
control cost as you scale.

## Step 4: Drill into traces

Select **View traces with agent runs** to list every agent execution. Each row is
one workflow run. Filter by time range, status (success or failure), or a specific
agent.

## Step 5: Follow an end-to-end transaction

Select any trace to open the **end-to-end transaction details**. The simple view
renders the workflow as a story: the Coordinator dispatches work to each
specialist, the Currency and Weather agents make tool calls to the Frankfurter and
National Weather Service APIs, and the Coordinator aggregates everything into the
final itinerary. You can see which agent handled each step, how long it took, and
which tools it called.

:::tip Explore in Grafana
For ongoing monitoring rather than ad-hoc investigation, select **Explore in
Grafana** from the Agents view to open prebuilt Agent Framework dashboards. They
query the same Log Analytics data, so no extra instrumentation is needed.
:::

## Verify

You have observed the app when you can answer these questions from the portal:

- Which six agents appear in the dropdown?
- Which agent consumed the most output tokens across your runs?
- In one transaction, which agents made tool calls, and to which external APIs?

If you can answer all three, your telemetry pipeline is working end to end.

## Summary

Without touching code, you traced a multi-agent workflow across six agents, saw
per-agent token usage, and followed a single travel plan from request to finished
itinerary. You now know **what** the agents are doing. The last question is **what
they are allowed to do** - next, you add governance so a policy decides which tools
each agent may call.

## Learn more

- [Monitor Azure App Service](https://learn.microsoft.com/azure/app-service/monitor-app-service)
- [Azure Monitor OpenTelemetry Distro](https://learn.microsoft.com/azure/azure-monitor/app/opentelemetry-enable)
- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Application Insights overview](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview)

<PathNav pathId="govern-multi-agent-ai" step={2} />
