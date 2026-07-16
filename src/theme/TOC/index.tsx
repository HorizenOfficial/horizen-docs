import React, { type ReactNode } from 'react';
import TOCOriginal from '@theme-original/TOC';
import type { Props } from '@theme/TOC';
import styles from './styles.module.css';

export default function TOC(props: Props): ReactNode {
  return (
    <>
      <p className={styles.tocHeading}>On this page</p>
      <TOCOriginal {...props} />
    </>
  );
}
