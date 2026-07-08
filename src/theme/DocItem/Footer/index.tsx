import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import TagsListInline from '@theme/TagsListInline';
import EditThisPage from '@theme/EditThisPage';
import LastUpdated from '@theme/LastUpdated';
import PageFeedback from '@site/src/components/PageFeedback';
import styles from './styles.module.css';

// Full replacement for the docs footer. It mirrors the stock layout (tags row,
// then an edit-meta row) but adds the per-page "Report an issue" link into the
// right-hand column so it sits inline with, and right-aligned against, the
// "Edit this page" link instead of stacking as its own block.
export default function DocItemFooter(): React.ReactNode {
  const {metadata} = useDoc();
  const {editUrl, lastUpdatedAt, lastUpdatedBy, tags} = metadata;

  const canDisplayTagsRow = tags.length > 0;

  return (
    <footer className={clsx(ThemeClassNames.docs.docFooter, 'docusaurus-mt-lg')}>
      {canDisplayTagsRow && (
        <div
          className={clsx(
            'row margin-top--sm',
            ThemeClassNames.docs.docFooterTagsRow,
          )}>
          <div className="col">
            <TagsListInline tags={tags} />
          </div>
        </div>
      )}

      <div
        className={clsx(
          'row margin-top--sm',
          ThemeClassNames.docs.docFooterEditMetaRow,
        )}>
        <div className="col">{editUrl && <EditThisPage editUrl={editUrl} />}</div>
        <div className={clsx('col', styles.right)}>
          {(lastUpdatedAt || lastUpdatedBy) && (
            <LastUpdated
              lastUpdatedAt={lastUpdatedAt}
              lastUpdatedBy={lastUpdatedBy}
            />
          )}
          <PageFeedback />
        </div>
      </div>
    </footer>
  );
}
