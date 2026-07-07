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
      'Carry one app - Contoso Widgets - from a plain first deploy to an enterprise-grade app, adding one capability per step.',
    steps: [
      {
        title: 'Deploy the app',
        summary: 'Get Contoso Widgets running on App Service with its in-memory catalog.',
        category: 'Getting started',
        time: '15-20 min',
        to: '/docs/learning-paths/deploy-the-app',
        status: 'available',
      },
      {
        title: 'Externalize configuration',
        summary: 'Move the storefront title and welcome message into app settings.',
        category: 'Configuration',
        time: '15-20 min',
        to: '/docs/learning-paths/externalize-configuration',
        status: 'available',
      },
      {
        title: 'Connect a database with managed identity',
        summary: 'Read the catalog from Azure SQL, passwordless, using the app identity.',
        category: 'Data & integration',
        time: '25-35 min',
        to: '/docs/learning-paths/connect-a-database',
        status: 'available',
      },
      {
        title: 'Move secrets to Key Vault',
        summary: 'Store the partner API key in Key Vault and reference it from an app setting.',
        category: 'Security & identity',
        time: '25-35 min',
        status: 'coming-soon',
      },
      {
        title: 'Add health checks and Always On',
        summary: 'Wire up the health probe and keep instances warm.',
        category: 'Reliability & operations',
        time: '15-20 min',
        status: 'coming-soon',
      },
      {
        title: 'Scale out with autoscale',
        summary: 'Add rules that add and remove instances as load changes.',
        category: 'Scaling & performance',
        time: '20-30 min',
        status: 'coming-soon',
      },
      {
        title: 'Release safely with deployment slots',
        summary: 'Stage changes and swap with zero downtime.',
        category: 'Deployment & CI/CD',
        time: '25-35 min',
        status: 'coming-soon',
      },
      {
        title: 'Add monitoring and alerts',
        summary: 'Turn on Application Insights telemetry and create alerts.',
        category: 'Monitoring & diagnostics',
        time: '30-40 min',
        status: 'coming-soon',
      },
      {
        title: 'Lock down access with Entra ID',
        summary: "Require sign-in with the platform's built-in authentication.",
        category: 'Security & identity',
        time: '20-30 min',
        status: 'coming-soon',
      },
      {
        title: 'Isolate the backend with private networking',
        summary: 'Add VNet integration and reach the database over a private endpoint.',
        category: 'Networking',
        time: '30-40 min',
        status: 'coming-soon',
      },
      {
        title: 'Automate delivery with GitHub Actions',
        summary: 'Build and deploy to a slot on every push.',
        category: 'Deployment & CI/CD',
        time: '25-35 min',
        status: 'coming-soon',
      },
    ],
  },
};

export function getPath(pathId: string): LearningPathDef | undefined {
  return paths[pathId];
}
