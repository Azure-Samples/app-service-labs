import type {ReactNode} from 'react';
import styles from './styles.module.css';

interface UnderConstructionProps {
  title?: string;
  children?: ReactNode;
}

export default function UnderConstruction({
  title = 'Under construction',
  children,
}: UnderConstructionProps): ReactNode {
  return (
    <div className={styles.banner} role="note" aria-label={title}>
      <span className={styles.icon} aria-hidden="true">
        🚧
      </span>
      <div className={styles.content}>
        <strong className={styles.title}>{title}</strong>
        <div className={styles.body}>
          {children ?? (
            <>
              We&apos;re building out the App Service Labs content. Check back
              soon &mdash; new hands-on labs and workshops are on the way.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
