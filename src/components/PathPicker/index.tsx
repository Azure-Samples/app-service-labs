import {type ReactNode, useCallback} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './styles.module.css';

interface PathOption {
  value: string;
  label: string;
}

interface PathGroup {
  /** Must match the `groupId` of the inline <Tabs> this option drives. */
  id: string;
  label: string;
  options: PathOption[];
}

interface PathPickerProps {
  title?: string;
  description?: ReactNode;
  groups: PathGroup[];
}

// Docusaurus stores a tab group's choice under this localStorage key and, when
// the tabs use `queryString`, under a URL search param named after the groupId.
// Writing both keeps this picker in sync with every inline <Tabs> on the page.
const storageKey = (id: string): string => `docusaurus.tab.${id}`;

export default function PathPicker({
  title = 'Choose your path',
  description,
  groups,
}: PathPickerProps): ReactNode {
  const history = useHistory();
  const location = useLocation();
  const isBrowser = useIsBrowser();

  const getSelected = (group: PathGroup): string => {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get(group.id);
    if (fromQuery && group.options.some((o) => o.value === fromQuery)) {
      return fromQuery;
    }
    if (isBrowser) {
      try {
        const fromStorage = localStorage.getItem(storageKey(group.id));
        if (fromStorage && group.options.some((o) => o.value === fromStorage)) {
          return fromStorage;
        }
      } catch {
        // Ignore storage access errors (e.g. privacy mode).
      }
    }
    return group.options[0]?.value ?? '';
  };

  const select = useCallback(
    (group: PathGroup, value: string) => {
      const params = new URLSearchParams(history.location.search);
      params.set(group.id, value);
      history.replace({...history.location, search: params.toString()});
      try {
        localStorage.setItem(storageKey(group.id), value);
      } catch {
        // Ignore storage access errors.
      }
    },
    [history],
  );

  return (
    <div className={styles.picker} role="group" aria-label={title}>
      <div className={styles.header}>
        <span className={styles.icon} aria-hidden="true">
          🧭
        </span>
        <div>
          <strong className={styles.title}>{title}</strong>
          {description ? (
            <div className={styles.description}>{description}</div>
          ) : null}
        </div>
      </div>
      <div className={styles.groups}>
        {groups.map((group) => {
          const selected = getSelected(group);
          return (
            <div className={styles.group} key={group.id}>
              <span className={styles.groupLabel}>{group.label}</span>
              <div
                className={styles.options}
                role="group"
                aria-label={group.label}>
                {group.options.map((opt) => {
                  const active = selected === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      className={`${styles.option} ${
                        active ? styles.optionActive : ''
                      }`}
                      aria-pressed={active}
                      onClick={() => select(group, opt.value)}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
