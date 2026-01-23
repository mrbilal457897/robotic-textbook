import React, { type ReactNode } from 'react';
import DocItemPre from '@theme-original/DocItem';

interface DocItemProps {
  children?: ReactNode;
  [key: string]: unknown;
}

/**
 * Wrapper for default Docusaurus DocItem
 * - Renders markdown content properly with DocProvider context
 */
export default function DocItem(props: DocItemProps): JSX.Element {
  return <DocItemPre {...props} />;
}
