import React, { type ReactNode } from 'react';
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import type { Props } from '@theme/DocBreadcrumbs';
import AIToolsDropdown from '@site/src/components/AIToolsDropdown';
import styles from './styles.module.css';

export default function DocBreadcrumbsWrapper(props: Props): ReactNode {
  return (
    <div className={styles.breadcrumbRow}>
      <div className={styles.breadcrumbWrap}>
        <DocBreadcrumbs {...props} />
      </div>
      <AIToolsDropdown />
    </div>
  );
}
