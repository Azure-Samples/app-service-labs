import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

const REPO = 'Azure-Samples/app-service-labs';

// Builds a pre-filled "new issue" URL for the current doc page so readers can
// report problems or ask questions without hunting for the repo. The page title
// and URL are injected automatically; the reader just describes the issue.
function buildIssueUrl(pageTitle: string, pageUrl: string): string {
  const title = `[Docs feedback] ${pageTitle}`;
  const body = [
    `**Page:** ${pageTitle}`,
    `**URL:** ${pageUrl}`,
    '',
    '---',
    '',
    '<!-- What is wrong, confusing, or missing on this page? For a lab, include the step number and any error output. -->',
    '',
  ].join('\n');
  const params = new URLSearchParams({
    title,
    body,
    labels: 'documentation',
  });
  return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}

export default function PageFeedback(): React.ReactNode {
  const {metadata} = useDoc();
  const {siteConfig} = useDocusaurusContext();

  // metadata.permalink already includes the site baseUrl (for example,
  // /app-service-labs/docs/...), so prefix it with the site origin only.
  const pageUrl = `${siteConfig.url}${metadata.permalink}`;
  const issueUrl = buildIssueUrl(metadata.title, pageUrl);

  return (
    <div className={styles.feedback}>
      <span className={styles.prompt}>
        Found a problem on this page or have a question?
      </span>
      <a
        className={styles.button}
        href={issueUrl}
        target="_blank"
        rel="noopener noreferrer">
        Open a GitHub issue
      </a>
    </div>
  );
}
