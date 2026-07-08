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
    <a
      className={styles.link}
      href={issueUrl}
      target="_blank"
      rel="noopener noreferrer">
      <svg
        className={styles.icon}
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
      Report an issue on GitHub
    </a>
  );
}
