import React, { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { buildAIToolUrl } from '@site/src/utils/buildAIToolUrl';
import styles from './styles.module.css';

type CopyState = 'idle' | 'copied' | 'error';

function ClaudeIcon(): ReactNode {
  return <img className={styles.brandIcon} src="/icons/claude-color.svg" alt="" aria-hidden="true" />;
}

function ChatGPTIcon(): ReactNode {
  return <img className={styles.brandIcon} src="/icons/chatgpt-icon.svg" alt="" aria-hidden="true" />;
}

function PerplexityIcon(): ReactNode {
  return <img className={styles.brandIcon} src="/icons/perplexity-ai-icon.svg" alt="" aria-hidden="true" />;
}

function GeminiIcon(): ReactNode {
  return <img className={styles.brandIcon} src="/icons/google-gemini-icon.svg" alt="" aria-hidden="true" />;
}

function ClipboardIcon(): ReactNode {
  return (
    <svg className={styles.icon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="9" rx="1.5" />
      <path d="M5.5 6.5H4a1.5 1.5 0 00-1.5 1.5v6A1.5 1.5 0 004 15.5h6A1.5 1.5 0 0011.5 14v-1" />
      <path d="M7 5.5V4a1 1 0 011-1h2a1 1 0 011 1v1.5" />
    </svg>
  );
}

function MarkdownIcon(): ReactNode {
  return (
    <svg className={styles.icon} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 1.5H3.5A1.5 1.5 0 002 3v10a1.5 1.5 0 001.5 1.5h9A1.5 1.5 0 0014 13V6.5L9 1.5z" />
      <path d="M9 1.5V6.5H14" />
      <path d="M5 9.5h6M5 12h4" />
    </svg>
  );
}

async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const el = document.createElement('textarea');
  el.value = text;
  el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
  document.body.appendChild(el);
  el.focus();
  el.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(el);
  if (!ok) throw new Error('execCommand copy failed');
}

export default function AIToolsDropdown(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [markdown, setMarkdown] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const cleanPath = pathname.replace(/\/$/, '');
  const pageUrl = siteConfig.url + cleanPath;
  const mdUrl = pageUrl + '.md';

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open || markdown) return;
    fetch(mdUrl)
      .then((r) => (r.ok ? r.text() : ''))
      .then((text) => setMarkdown(text))
      .catch(() => setMarkdown(''));
  }, [open, mdUrl, markdown]);

  useEffect(() => {
    setMarkdown('');
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  async function handleCopy() {
    try {
      const text = markdown || await fetch(mdUrl).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      });
      await copyToClipboard(text);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    } finally {
      setTimeout(() => setCopyState('idle'), 2000);
    }
    close();
  }

  const copyLabel =
    copyState === 'copied' ? '✓ Copied!' : copyState === 'error' ? 'Failed' : 'Copy page';

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Open in AI tools
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <a className={styles.menuItem} href={buildAIToolUrl('claude', pageUrl, markdown, mdUrl)} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={close}>
            <ClaudeIcon />
            <span className={styles.menuItemText}>
              <span>Open in Claude</span>
              <span className={styles.menuItemSub}>Ask questions about this page</span>
            </span>
          </a>
          <a className={styles.menuItem} href={buildAIToolUrl('chatgpt', pageUrl, markdown, mdUrl)} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={close}>
            <ChatGPTIcon />
            <span className={styles.menuItemText}>
              <span>Open in ChatGPT</span>
              <span className={styles.menuItemSub}>Ask questions about this page</span>
            </span>
          </a>
          <a className={styles.menuItem} href={buildAIToolUrl('perplexity', pageUrl, markdown, mdUrl)} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={close}>
            <PerplexityIcon />
            <span className={styles.menuItemText}>
              <span>Open in Perplexity</span>
              <span className={styles.menuItemSub}>Ask questions about this page</span>
            </span>
          </a>
          <a className={styles.menuItem} href={buildAIToolUrl('gemini', pageUrl, markdown, mdUrl)} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={close}>
            <GeminiIcon />
            <span className={styles.menuItemText}>
              <span>Open in Gemini</span>
              <span className={styles.menuItemSub}>Ask questions about this page</span>
            </span>
          </a>

          <hr className={styles.divider} />

          <button
            type="button"
            className={`${styles.menuItem} ${copyState === 'copied' ? styles.copySuccess : copyState === 'error' ? styles.copyError : ''}`}
            role="menuitem"
            onClick={handleCopy}
          >
            <ClipboardIcon />
            <span className={styles.menuItemText}>
              <span>{copyLabel}</span>
              <span className={styles.menuItemSub}>View this page as a plain text</span>
            </span>
          </button>

          <a className={styles.menuItem} href={mdUrl} target="_blank" rel="noopener noreferrer" role="menuitem" onClick={close}>
            <MarkdownIcon />
            <span className={styles.menuItemText}>
              <span>View as markdown</span>
              <span className={styles.menuItemSub}>View this page as a plain text</span>
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
