import {type ReactNode, useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {getPath} from './paths';
import styles from './styles.module.css';

interface LearningPathProps {
  pathId: string;
}

const doneKey = (pathId: string, index: number): string =>
  `docusaurus.lp.${pathId}.${index}`;

export default function LearningPath({pathId}: LearningPathProps): ReactNode {
  const path = getPath(pathId);
  const isBrowser = useIsBrowser();
  const [done, setDone] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isBrowser || !path) {
      return;
    }
    const next: Record<number, boolean> = {};
    path.steps.forEach((_, i) => {
      try {
        next[i] = localStorage.getItem(doneKey(pathId, i)) === '1';
      } catch {
        // Ignore storage access errors (for example, privacy mode).
      }
    });
    setDone(next);
  }, [isBrowser, path, pathId]);

  if (!path) {
    return null;
  }

  const toggle = (index: number): void => {
    setDone((prev) => {
      const value = !prev[index];
      try {
        if (value) {
          localStorage.setItem(doneKey(pathId, index), '1');
        } else {
          localStorage.removeItem(doneKey(pathId, index));
        }
      } catch {
        // Ignore storage access errors.
      }
      return {...prev, [index]: value};
    });
  };

  const availableCount = path.steps.filter((s) => s.status === 'available').length;
  const completed = path.steps.filter((s, i) => s.status === 'available' && done[i]).length;
  const pct = availableCount ? Math.round((completed / availableCount) * 100) : 0;

  return (
    <div className={styles.path}>
      <div className={styles.progress}>
        <div className={styles.progressText}>
          {completed} of {availableCount} available steps complete
        </div>
        <div className={styles.bar} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.fill} style={{transform: `scaleX(${pct / 100})`}} />
        </div>
      </div>

      <ol className={styles.steps}>
        {path.steps.map((step, index) => {
          const isDone = done[index];
          const isAvailable = step.status === 'available';
          return (
            <li
              key={index}
              className={`${styles.step} ${isAvailable ? '' : styles.soon} ${isDone ? styles.doneStep : ''}`}>
              <div className={styles.marker} aria-hidden="true">
                {isDone ? '✓' : index + 1}
              </div>
              <div className={styles.body}>
                <div className={styles.titleRow}>
                  {isAvailable && step.to ? (
                    <Link className={styles.title} to={step.to}>
                      {step.title}
                    </Link>
                  ) : (
                    <span className={styles.title}>{step.title}</span>
                  )}
                  {!isAvailable && <span className={styles.soonTag}>Coming soon</span>}
                </div>
                <div className={styles.meta}>
                  <span className={styles.cat}>{step.category}</span>
                  <span className={styles.time}>{step.time}</span>
                </div>
                <p className={styles.summary}>{step.summary}</p>
                {isAvailable && (
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      checked={Boolean(isDone)}
                      onChange={() => toggle(index)}
                    />
                    Mark complete
                  </label>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
