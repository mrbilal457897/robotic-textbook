import React from 'react';
import { useLocation } from '@docusaurus/router';
import DocItemLayout from '@theme/DocItem/Layout';
import ReadingTime from '@site/src/components/ReadingTime';
import styles from './styles.module.css';

interface DocItemProps {
  children: React.ReactNode;
  content: {
    metadata?: {
      title?: string;
      id?: string;
      unversionedId?: string;
    };
    toc?: Array<{
      value: string;
      level: number;
      id: string;
    }>;
    frontMatter?: {
      title?: string;
      reading_time?: number;
    };
  };
}

interface HeadingElement extends HTMLElement {
  textContent?: string;
}

/**
 * Custom Doc page layout component that extends Docusaurus default DocItem
 * - Displays reading time estimate below title
 * - Renders table of contents on the right
 * - Displays main content
 * - Shows Previous/Next navigation buttons at bottom
 * - Includes "Edit on GitHub" link
 */
export default function DocItem({ children, content }: DocItemProps): JSX.Element {
  const location = useLocation();
  const title = content?.metadata?.title || content?.frontMatter?.title || 'Documentation';
  const docId = content?.metadata?.id || content?.metadata?.unversionedId || '';

  // Extract word count from rendered content to calculate reading time
  const getWordCount = (): number => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = children as string;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.split(/\s+/).filter(word => word.length > 0).length;
  };

  const wordCount = typeof document !== 'undefined' ? getWordCount() : 0;
  const codeBlocks = (children as string)?.match(/<pre><code/g)?.length || 0;
  const diagrams = (children as string)?.match(/class="mermaid"/g)?.length || 0;

  // Build GitHub edit link
  const getEditUrl = (): string => {
    const pathWithoutLocale = location.pathname
      .split('/')
      .filter((part: string) => part && !['en', 'ur', 'ar', 'zh', 'es'].includes(part))
      .join('/');
    const docPath = pathWithoutLocale.replace(/\/$/, '').replace(/^\//, '');
    return `https://github.com/YOUR_ORG/physical-ai-textbook/edit/main/docs/${docPath}.md`;
  };

  return (
    <div className={styles.docContainer}>
      <article className={styles.docContent}>
        {/* Page Title */}
        <header className={styles.docHeader}>
          <h1 className={styles.docTitle}>{title}</h1>

          {/* Reading Time Display */}
          <div className={styles.readingTimeWrapper}>
            <ReadingTime
              wordCount={wordCount}
              codeBlocks={codeBlocks}
              diagrams={diagrams}
            />
          </div>
        </header>

        {/* Main Content */}
        <div className={styles.docBody}>
          <div className={styles.contentWrapper}>
            {children}
          </div>

          {/* Edit on GitHub Link */}
          <div className={styles.editLink}>
            <a
              href={getEditUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.editLinkAnchor}
            >
              Edit this page on GitHub
            </a>
          </div>
        </div>
      </article>

      {/* Table of Contents Sidebar */}
      {content?.toc && content.toc.length > 0 && (
        <aside className={styles.tocSidebar}>
          <div className={styles.tocContainer}>
            <div className={styles.tocTitle}>On this page</div>
            <nav className={styles.toc}>
              <ul className={styles.tocList}>
                {content.toc.map((item, index) => (
                  <li
                    key={index}
                    className={`${styles.tocItem} ${styles[`level-${item.level}`]}`}
                  >
                    <a href={`#${item.id}`} className={styles.tocLink}>
                      {item.value}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
}
