// Single source of truth for the learning paths. Both the <LearningPath> stepper
// on a path's overview page and the <PathNav> footer on each step read from here,
// so step order, titles, and links never drift apart.

export interface PathStep {
  /** Short imperative title shown in the stepper. */
  title: string;
  /** One-line description of what this step adds to the app. */
  summary: string;
  /** Category the underlying lab belongs to. */
  category: string;
  /** Estimated time, e.g. '15-20 min'. */
  time: string;
  /** Docs link. Omit when the step is not published yet. */
  to?: string;
  /** 'available' steps are published; 'coming-soon' steps are on the roadmap. */
  status: 'available' | 'coming-soon';
}

export interface LearningPathDef {
  title: string;
  tagline: string;
  steps: PathStep[];
}

export const paths: Record<string, LearningPathDef> = {
  'enterprise-web-app': {
    title: 'From first deploy to enterprise-grade',
    tagline:
      'Carry one app - Zava Widgets - from a plain first deploy to an enterprise-grade app, adding one capability per step.',
    steps: [
      {
        title: 'Deploy the app',
        summary: 'Get Zava Widgets running on App Service with its in-memory catalog.',
        category: 'Getting started',
        time: '15-20 min',
        to: '/docs/learning-paths/enterprise-web-app/deploy-the-app',
        status: 'available',
      },
      {
        title: 'Externalize configuration',
        summary: 'Move the storefront title and welcome message into app settings.',
        category: 'Configuration',
        time: '15-20 min',
        to: '/docs/learning-paths/enterprise-web-app/externalize-configuration',
        status: 'available',
      },
      {
        title: 'Connect a database with managed identity',
        summary: 'Read the catalog from Azure SQL, passwordless, using the app identity.',
        category: 'Data & integration',
        time: '25-35 min',
        to: '/docs/learning-paths/enterprise-web-app/connect-a-database',
        status: 'available',
      },
      {
        title: 'Move secrets to Key Vault',
        summary: 'Store the partner API key in Key Vault and reference it from an app setting.',
        category: 'Security & identity',
        time: '25-35 min',
        to: '/docs/learning-paths/enterprise-web-app/move-secrets-to-key-vault',
        status: 'available',
      },
      {
        title: 'Add health checks and Always On',
        summary: 'Wire up the health probe and keep instances warm.',
        category: 'Reliability & operations',
        time: '15-20 min',
        to: '/docs/learning-paths/enterprise-web-app/add-health-checks',
        status: 'available',
      },
      {
        title: 'Scale out with autoscale',
        summary: 'Add rules that add and remove instances as load changes.',
        category: 'Scaling & performance',
        time: '20-30 min',
        to: '/docs/learning-paths/enterprise-web-app/scale-out-with-autoscale',
        status: 'available',
      },
      {
        title: 'Release safely with deployment slots',
        summary: 'Stage changes and swap with zero downtime.',
        category: 'Deployment & CI/CD',
        time: '25-35 min',
        to: '/docs/learning-paths/enterprise-web-app/release-with-deployment-slots',
        status: 'available',
      },
      {
        title: 'Add monitoring and alerts',
        summary: 'Turn on Application Insights telemetry and create alerts.',
        category: 'Monitoring & diagnostics',
        time: '30-40 min',
        to: '/docs/learning-paths/enterprise-web-app/add-monitoring',
        status: 'available',
      },
      {
        title: 'Lock down access with Entra ID',
        summary: "Require sign-in with the platform's built-in authentication.",
        category: 'Security & identity',
        time: '20-30 min',
        to: '/docs/learning-paths/enterprise-web-app/require-sign-in',
        status: 'available',
      },
      {
        title: 'Isolate the backend with private networking',
        summary: 'Add VNet integration and reach the database over a private endpoint.',
        category: 'Networking',
        time: '30-40 min',
        to: '/docs/learning-paths/enterprise-web-app/private-networking',
        status: 'available',
      },
      {
        title: 'Automate delivery with GitHub Actions',
        summary: 'Build and deploy to a slot on every push.',
        category: 'Deployment & CI/CD',
        time: '25-35 min',
        to: '/docs/learning-paths/enterprise-web-app/automate-with-github-actions',
        status: 'available',
      },
    ],
  },
  'govern-multi-agent-ai': {
    title: 'Build, observe, and govern multi-agent AI',
    tagline:
      'Carry one multi-agent AI app - a six-agent travel planner - from a first deploy to a fully observable and policy-governed app on App Service.',
    steps: [
      {
        title: 'Deploy the multi-agent app',
        summary: 'Deploy the six-agent travel planner to App Service with the Azure Developer CLI.',
        category: 'Scenarios & modern apps',
        time: '30-40 min',
        to: '/docs/learning-paths/govern-multi-agent-ai/deploy-the-agents',
        status: 'available',
      },
      {
        title: 'Observe the agents',
        summary: 'Trace every agent, token, and tool call in the Application Insights Agents view.',
        category: 'Monitoring & diagnostics',
        time: '20-30 min',
        to: '/docs/learning-paths/govern-multi-agent-ai/observe-the-agents',
        status: 'available',
      },
      {
        title: 'Govern the agents',
        summary: 'Enforce policies on agent tool calls with the Agent Governance Toolkit.',
        category: 'Security & identity',
        time: '30-40 min',
        to: '/docs/learning-paths/govern-multi-agent-ai/govern-the-agents',
        status: 'available',
      },
    ],
  },
};

export function getPath(pathId: string): LearningPathDef | undefined {
  return paths[pathId];
}

export interface LearningPathSummary {
  /** Path id; matches a key in `paths` when the path is published. */
  id: string;
  /** Display title of the path. */
  title: string;
  /** One-line description shown on the path card. */
  description: string;
  /** Emoji shown on the card. */
  icon: string;
  /** Skill level. */
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  /** Number of steps in the path. */
  steps: number;
  /** Estimated total time across all steps, e.g. '4-6 hours'. */
  time: string;
  /** Landing page for the path. Omit when the path is not published yet. */
  to?: string;
  /** 'available' paths are published; 'coming-soon' paths are on the roadmap. */
  status: 'available' | 'coming-soon';
}

// Catalog of every learning path, published or planned. The section overview page
// (<LearningPathCatalog>) renders one card per entry so users can pick a path.
export const catalog: LearningPathSummary[] = [
  {
    id: 'enterprise-web-app',
    title: 'Enterprise web app',
    description:
      'Carry one app from a plain first deploy to an enterprise-grade app, adding one capability per step - configuration, database, secrets, resilience, scale, monitoring, sign-in, private networking, and CI/CD.',
    icon: '🏢',
    level: 'Intermediate',
    steps: 11,
    time: '4-6 hours',
    to: '/docs/learning-paths/enterprise-web-app',
    status: 'available',
  },
  {
    id: 'govern-multi-agent-ai',
    title: 'Govern multi-agent AI',
    description:
      'Build, observe, and govern a multi-agent AI app on App Service. Deploy a six-agent travel planner built with the Microsoft Agent Framework, trace every agent and token in the Application Insights Agents view, then enforce tool-call policies with the Agent Governance Toolkit.',
    icon: '🛡️',
    level: 'Advanced',
    steps: 3,
    time: '2-3 hours',
    to: '/docs/learning-paths/govern-multi-agent-ai',
    status: 'available',
  },
  {
    id: 'ai-app',
    title: 'AI-powered app',
    description:
      'Add generative AI to a web app on App Service - connect to Azure AI Foundry, ground responses on your own data with retrieval, and ship a chat experience securely with managed identity.',
    icon: '🤖',
    level: 'Intermediate',
    steps: 0,
    time: 'Coming soon',
    status: 'coming-soon',
  },
  {
    id: 'managed-instance',
    title: 'Modernize with Managed Instance',
    description:
      'Lift an existing ASP.NET application onto App Service, then modernize it step by step - OS-level customization, storage mounts, and the path to a fully managed, secure hosting model.',
    icon: '🖥️',
    level: 'Advanced',
    steps: 0,
    time: 'Coming soon',
    status: 'coming-soon',
  },
];

