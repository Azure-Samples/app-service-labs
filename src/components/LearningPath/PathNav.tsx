import {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {getPath} from './paths';
import styles from './styles.module.css';

interface PathNavProps {
  pathId: string;
  /** 1-based step number within the path. */
  step: number;
}

// Footer shown on each path step. It derives the "Step N of M" banner and the
// previous/next links from paths.ts, so authors only pass the current step.
export default function PathNav({pathId, step}: PathNavProps): ReactNode {
  const path = getPath(pathId);
  if (!path) {
    return null;
  }
  const total = path.steps.length;
  const index = step - 1;
  const prev = index > 0 ? path.steps[index - 1] : undefined;
  const next = index < total - 1 ? path.steps[index + 1] : undefined;

  return (
    <nav className={styles.nav} aria-label="Learning path navigation">
      <div className={styles.navBanner}>
        <Link to="/docs/learning-paths/overview">{path.title}</Link>
        <span className={styles.navStep}>
          Step {step} of {total}
        </span>
      </div>
      <div className={styles.navLinks}>
        {prev && prev.to ? (
          <Link className={`${styles.navLink} ${styles.navPrev}`} to={prev.to}>
            <span className={styles.navDir}>Previous</span>
            <span className={styles.navTitle}>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && next.to ? (
          <Link className={`${styles.navLink} ${styles.navNext}`} to={next.to}>
            <span className={styles.navDir}>Next</span>
            <span className={styles.navTitle}>{next.title}</span>
          </Link>
        ) : next ? (
          <span className={`${styles.navLink} ${styles.navNext} ${styles.navDisabled}`}>
            <span className={styles.navDir}>Next</span>
            <span className={styles.navTitle}>{next.title} (coming soon)</span>
          </span>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );
}
