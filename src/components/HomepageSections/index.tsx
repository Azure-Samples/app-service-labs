import {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import LearningPathCatalog from '../LearningPath/Catalog';
import styles from './styles.module.css';

interface Category {
  label: string;
  icon: string;
  to: string;
  description: string;
}

// Browse-by-topic entry points. Each links to the category overview page.
const categories: Category[] = [
  {
    label: 'Getting started',
    icon: '🚀',
    to: '/docs/getting-started/overview',
    description: 'Deploy your first web app and custom container.',
  },
  {
    label: 'Scenarios & modern apps',
    icon: '🧩',
    to: '/docs/scenarios-and-modern-apps/overview',
    description: 'AI apps, containers, and modern app patterns.',
  },
  {
    label: 'Deployment & CI/CD',
    icon: '🔁',
    to: '/docs/deployment-and-cicd/overview',
    description: 'Slots, GitHub Actions, and safe releases.',
  },
  {
    label: 'Configuration',
    icon: '⚙️',
    to: '/docs/configuration/overview',
    description: 'App settings, connection strings, and startup.',
  },
  {
    label: 'Networking',
    icon: '🌐',
    to: '/docs/networking/overview',
    description: 'VNet integration, private endpoints, and access.',
  },
  {
    label: 'Security & identity',
    icon: '🔒',
    to: '/docs/security-and-identity/overview',
    description: 'Managed identity, Key Vault, and sign-in.',
  },
  {
    label: 'Scaling & performance',
    icon: '📈',
    to: '/docs/scaling-and-performance/overview',
    description: 'Scale up, scale out, and autoscale rules.',
  },
  {
    label: 'Monitoring & diagnostics',
    icon: '🔎',
    to: '/docs/monitoring-and-diagnostics/overview',
    description: 'Application Insights, logs, and alerts.',
  },
  {
    label: 'Data & integration',
    icon: '🗄️',
    to: '/docs/data-and-integration/overview',
    description: 'Connect to databases and Azure services.',
  },
  {
    label: 'Reliability & operations',
    icon: '🛠️',
    to: '/docs/reliability-and-operations/overview',
    description: 'Health checks, Always On, and resilience.',
  },
  {
    label: 'Migration & modernization',
    icon: '📦',
    to: '/docs/migration-and-modernization/overview',
    description: 'Move existing apps onto App Service.',
  },
  {
    label: 'Advanced',
    icon: '🧠',
    to: '/docs/advanced/overview',
    description: 'Deep dives and specialized configurations.',
  },
];

export default function HomepageSections(): ReactNode {
  return (
    <div className="container margin-bottom--xl">
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Learning paths</h2>
          <p className={styles.sectionLede}>
            Guided, multi-step journeys that carry one app forward - add a
            capability at every step until you reach a production-ready result.
          </p>
        </div>
        <LearningPathCatalog />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Browse by topic</h2>
          <p className={styles.sectionLede}>
            Prefer one thing at a time? Every standalone lab is grouped by
            topic - pick an area and dive in.
          </p>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((c) => (
            <Link key={c.to} to={c.to} className={styles.categoryCard}>
              <span className={styles.categoryIcon} aria-hidden="true">
                {c.icon}
              </span>
              <span className={styles.categoryText}>
                <span className={styles.categoryLabel}>{c.label}</span>
                <span className={styles.categoryDesc}>{c.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
