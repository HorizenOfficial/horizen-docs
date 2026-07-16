import React, { type ReactNode } from 'react';
import DocItemLayout from '@theme-original/DocItem/Layout';
import type { Props } from '@theme/DocItem/Layout';

export default function DocItemLayoutWrapper(props: Props): ReactNode {
  return <DocItemLayout {...props} />;
}
