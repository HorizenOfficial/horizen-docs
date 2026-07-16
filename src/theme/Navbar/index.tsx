import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import { useThemeConfig, useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import NavbarItem from '@theme/NavbarItem';
import SearchBar from '@theme/SearchBar';
import styles from './styles.module.css';

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function  DiscordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.138 18.116a19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.1 13.1 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

function ThemeToggle({ className }: { className?: string }) {
  const { colorMode, setColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  return (
    <button
      className={className !== undefined ? className : styles.iconLink}
      onClick={() => setColorMode(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      type="button"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function Navbar(): JSX.Element {
  const { navbar } = useThemeConfig();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logo = navbar.logo as any;
  const logoSrc = useBaseUrl(logo?.src);
  const logoDarkSrc = useBaseUrl(logo?.srcDark || logo?.src);
  const navItems = (navbar.items as any[]).filter(
    (item) => item.position !== 'right'
  );

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const brand = (onClick?: () => void) => (
    <Link to="/" className={styles.brand} aria-label="Horizen home" onClick={onClick}>
      <img src={logoSrc} className={`${styles.logo} ${styles.logoLight}`} alt={logo?.alt || 'Horizen'} />
      <img src={logoDarkSrc} className={`${styles.logo} ${styles.logoDark}`} alt={logo?.alt || 'Horizen'} />
      <span className={styles.brandDivider} aria-hidden="true" />
      <span className={styles.brandLabel}>DOCUMENTATION</span>
    </Link>
  );

  return (
    <>
      <header className={`navbar ${styles.header}`} role="banner">
        {/* Row 1: Logo + utilities */}
        <div className={styles.topRow}>
          {brand()}

          <div className={styles.topRight}>
            <div className={styles.searchBtn}>
              <SearchBar />
            </div>
            <div className={styles.iconGroup}>
              <Link
                to="https://discord.gg/horizen-334085157441110017"
                className={styles.iconLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                title="Discord"
              >
                <DiscordIcon  />
              </Link>
              <Link
                to="https://github.com/HorizenOfficial"
                className={styles.iconLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <GitHubIcon />
              </Link>
              <ThemeToggle />
            </div>
            <button
              className={styles.mobileToggle}
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>

        {/* Row 2: Nav links (desktop only) */}
        <nav className={styles.navRow} aria-label="Main navigation">
          <ul className={styles.navItems}>
            {navItems.map((item, i) => (
              <li key={i} className={styles.navItemWrap}>
                <NavbarItem {...item} />
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile full-screen drawer */}
      {mobileOpen && (
        <div
          className={styles.mobileOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className={styles.mobileDrawerHeader}>
            {brand(() => setMobileOpen(false))}
            <button
              className={styles.mobileCloseBtn}
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          <div className={styles.mobileDrawerSearch}>
            <SearchBar />
          </div>

          <nav className={styles.mobileDrawerNav} aria-label="Mobile navigation">
            <ul className={styles.mobileNavItems}>
              {navItems.map((item, i) => (
                <li key={i} className={styles.mobileNavItemWrap} onClick={() => setMobileOpen(false)}>
                  <NavbarItem {...item} />
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.mobileDrawerFooter}>
            <div className={styles.mobileSocialLinks}>
              <Link to="https://t.me/horizenofficial" className={styles.mobileSocialLink} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <TelegramIcon />
              </Link>
              <Link to="https://twitter.com/horizenglobal" className={styles.mobileSocialLink} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <XIcon />
              </Link>
              <Link to="https://discord.gg/horizen-334085157441110017" className={styles.mobileSocialLink} target="_blank" rel="noopener noreferrer" aria-label="Discord">
                <DiscordIcon />
              </Link>
              <Link to="https://github.com/HorizenOfficial" className={styles.mobileSocialLink} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GitHubIcon />
              </Link>
            </div>
            <ThemeToggle className={styles.mobileThemeToggle} />
          </div>
        </div>
      )}
    </>
  );
}
