import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import styles from './notFound.module.css';

export default function NotFound(): ReactNode {
  return (
    <Layout title="Page not found">
      <main className={`container ${styles.wrap}`}>
        <img
          className={styles.mark}
          src={useBaseUrl('/img/app-service-labs-icon.svg')}
          alt="App Service Labs logo"
        />
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>This lab bench is empty</h1>
        <p className={styles.lede}>
          The page you were looking for moved, was renamed, or never existed.
          Let&apos;s get you back to something you can build with.
        </p>
        <div className={styles.actions}>
          <Link className="button button--primary button--lg" to="/">
            Back to home
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Browse workshops
          </Link>
        </div>
      </main>
    </Layout>
  );
}
