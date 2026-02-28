import React, { type ReactNode, useRef, useEffect } from 'react';
import DocItemPre from '@theme-original/DocItem';
import { useLocation } from '@docusaurus/router';
import FloatingFocusButton from '@site/src/components/FloatingFocusButton';

interface DocItemProps {
  children?: ReactNode;
  [key: string]: unknown;
}

/**
 * Wrapper for default Docusaurus DocItem
 * - Renders markdown content properly with DocProvider context
 * - Adds floating focus button for all module pages (overview and subsections)
 */
export default function DocItem(props: DocItemProps): JSX.Element {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if this is ANY module page (including all subsections)
  // Match patterns: /module-1-ros2/ or /module-1-ros2/introduction or /module-1-ros2/any-subsection
  const isModulePage = location.pathname.match(/\/module-\d+-/i) !== null;

  // Add data attribute to help with focus mode targeting
  useEffect(() => {
    if (isModulePage && contentRef.current) {
      const docContent = contentRef.current.querySelector('.theme-doc-markdown, article, main');
      if (docContent) {
        docContent.setAttribute('data-module-content', 'true');
      }
    }
  }, [isModulePage]);

  return (
    <div ref={contentRef}>
      <DocItemPre {...props} />
      {isModulePage && <FloatingFocusButton modulesSectionRef={contentRef} />}
    </div>
  );
}
