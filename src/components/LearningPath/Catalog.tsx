import {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {catalog} from './paths';
import styles from './catalog.module.css';

export default function LearningPathCatalog(): ReactNode {
  return (
    <div className={styles.grid}>
      {catalog.map((path) => {
        const isAvailable = path.status === 'available';
        const card = (
          <>
            <div className={styles.cardHead}>
              <span className={styles.icon} aria-hidden="true">
                {path.icon}
              </span>
              {!isAvailable && <span className={styles.soonTag}>Coming soon</span>}
            </div>
            <h3 className={styles.title}>{path.title}</h3>
            <p className={styles.description}>{path.description}</p>
            <div className={styles.meta}>
              <span className={styles.level}>{path.level}</span>
              {isAvailable && <span>{path.steps} steps</span>}
              <span>{path.time}</span>
            </div>
            {isAvailable && <span className={styles.cta}>Start path &rarr;</span>}
          </>
        );

        return isAvailable && path.to ? (
          <Link key={path.id} to={path.to} className={styles.card}>
            {card}
          </Link>
        ) : (
          <div key={path.id} className={`${styles.card} ${styles.soon}`}>
            {card}
          </div>
        );
      })}
    </div>
  );
}
