import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

/* ─── Start Building ────────────────────────────────────────────────────── */
const buildingCards = [
  {
    tag: 'EVM',
    title: 'Deploy Your First Contract',
    description: 'Standard EVM deployment on Horizen. Done in minutes with the tools you already know.',
    link: '/horizen-chain/deploy-contracts/using-foundry',
  },
  {
    tag: 'VELA',
    title: 'Your First Confidential App',
    description: 'Run attested computation inside a TEE. VELA is an emerging confidential coprocessor — start with a hello-world build and engage early.',
    link: '/vela/introduction',
  },
  {
    tag: 'BRIDGE',
    title: 'Bridge Assets to Horizen',
    description: 'Move ETH via the native OP Stack bridge, or bridge supported assets via Stargate.',
    link: '/horizen-chain/bridging/how-bridging-works',
  },
];

/* ─── Hero ──────────────────────────────────────────────────────────────── */
function Hero() {
  const features = ['Privacy tooling', 'Compliance plug-ins', 'Base liquidity'];

  return (
    <section
      className={[
        "relative overflow-hidden text-[#030E24]",
        "bg-[linear-gradient(203.13deg,#F4F4F4_14.42%,rgba(255,255,255,0)_65.77%)]",
        "[html[data-theme='dark']_&]:bg-[linear-gradient(203.13deg,#131D32_14.42%,rgba(3,14,36,0)_65.77%)]",
        "[html[data-theme='dark']_&]:text-white",
      ].join(' ')}
    >
      {/* backdrop — light */}
      <img
        src="/img/hero-pattern.svg"
        alt=""
        aria-hidden="true"
        className={`${styles.heroBackdrop} block [html[data-theme='dark']_&]:hidden`}
      />
      {/* backdrop — dark */}
      <img
        src="/img/dark-hero-pattern.svg"
        alt=""
        aria-hidden="true"
        className={`${styles.heroBackdrop} hidden [html[data-theme='dark']_&]:block`}
      />

      {/* hero content */}
      <div className="relative z-10 px-24 pt-37.5 pb-24 max-[900px]:px-8 max-[900px]:pt-24 max-[600px]:px-5 max-[600px]:pt-20 max-[600px]:pb-16">
        <div className="flex items-center justify-between gap-32 max-[900px]:flex-col max-[900px]:items-start max-[900px]:gap-10">
          <div className="flex-1 min-w-0 max-w-4xl">
            <div className="text-[clamp(2.4rem,5.5vw,4rem)] font-extrabold leading-[1.1] mb-6 text-[#030E24] tracking-tight [html[data-theme='dark']_&]:text-white" style={{ fontFamily: "'Funnel Display', sans-serif" }}>
              Horizen is home <br />
              for privacy-first <br />
              onchain app developers.
            </div>
            <div className="text-base leading-[1.7] text-[rgba(3,14,36,0.7)] m-0 max-w-130 [html[data-theme='dark']_&]:text-white/75">
              Horizen is an EVM-native L3 on Base designed for private onchain finance and compliance-forward blockchain app development.
            </div>
            <div className="flex gap-4 flex-wrap mt-7">
              <Link
                to={buildingCards[0].link}
              >
                <button
                  className="inline-flex border-none items-center justify-center h-12 px-8 rounded-[60px] text-[0.95rem] font-bold bg-[#FECB17] text-[#030E24]! no-underline! transition-colors duration-150 hover:bg-[#f5c800]"
                >
                  Get Started
                </button>
              </Link>
              <Link
                to={buildingCards[1].link}
              >
                <button
                  className="inline-flex items-center border-none justify-center h-12 px-8 rounded-[60px] text-[0.95rem] font-bold bg-[#FECB17] text-[#030E24]! no-underline! transition-colors duration-150 hover:bg-[#f5c800]"
                >
                  Learn More
                </button>

              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* What is Horizen */}
      <div className="px-24 py-24 max-[1100px]:px-10 max-[900px]:px-5 max-[900px]:py-14">
        <div className="grid grid-cols-3 items-start gap-6 w-full max-[900px]:grid-cols-1 max-[900px]:gap-7">
          <div className="min-w-0 max-[900px]:text-center">
            <div className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-[#030E24] m-0 leading-[1.15] tracking-tight [html[data-theme='dark']_&]:text-white" style={{ fontFamily: "'Funnel Display', sans-serif" }}>
              What is Horizen?
            </div>
          </div>
          <div className="max-[900px]:flex max-[900px]:flex-col max-[900px]:items-center max-[900px]:text-center">
            <p className="text-base font-semibold text-[#030E24] mb-3 [html[data-theme='dark']_&]:text-white">It adds what Base doesn't have</p>
            <div className="flex flex-wrap flex-1  gap-4 max-[900px]:justify-center">
              {features.map((f) => (
                <div
                  key={f}
                  className={[
                    "inline-flex items-center px-6 py-3 rounded-[10px] text-[1rem] font-extrabold leading-none",
                    "bg-[#FECB17] border-2 border-[#FECB17] text-[#030E24]",
                    "[html[data-theme='dark']_&]:bg-[#FFF5CE4D] [html[data-theme='dark']_&]:text-[#FECB17] [html[data-theme='dark']_&]:border-[#FECB17]",
                  ].join(' ')}
                >
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-0 max-[900px]:text-center">
            <p className="text-base leading-[1.8] text-[rgba(3,14,36,0.75)] m-0 [html[data-theme='dark']_&]:text-white/65">
              Horizen adds what other EVM chains lack – a tight focus and supportive tooling for private onchain finance and regulatory-compliant blockchain application development, while retaining what other privacy blockchain projects left behind – familiar EVM architecture, composability, and developer ergonomics.
              <strong> No new language, no obscure tech stack.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ─── L3 Banner ─────────────────────────────────────────────────────────── */
function L3Banner() {
  return (
    <div className="flex items-center justify-center py-8 px-8" style={{ background: 'linear-gradient(93.2deg, #030E24 2.62%, #1038BB 54.56%)' }}>
      <span className="font-bold text-[45px] leading-[120%] text-white text-center" style={{ fontFamily: "'Funnel Display', sans-serif" }}>
        Horizen is an EVM-compatible L3 built on{' '}
        <span className="font-bold text-white">
          <span className="inline-block mr-[0.15em] text-[0.75em] align-middle opacity-90">
            <span className="inline-block w-[0.60em] h-[0.60em] bg-white"></span>
          </span>base
        </span>
      </span>
    </div>
  );
}

/* ─── Choose Your Path ──────────────────────────────────────────────────── */
const personas = [
  {
    title: 'EVM Developer',
    description: 'Already building on Base or Ethereum? Deploy on Horizen in minutes with the same tools you use today.',
    link: '/horizen-chain/deploy-contracts/using-foundry',
    cta: 'Deploy a Contract',
    icon: (
      <svg width="58" height="58" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="70" height="70" rx="14" fill="#1038BB" />
        <path d="M29.1667 32.0834L26.25 35L29.1667 37.9167" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M40.8335 32.0834L43.7502 35L40.8335 37.9167" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M34.9998 49.5833C43.054 49.5833 49.5832 43.0541 49.5832 35C49.5832 26.9458 43.054 20.4166 34.9998 20.4166C26.9457 20.4166 20.4165 26.9458 20.4165 35C20.4165 43.0541 26.9457 49.5833 34.9998 49.5833Z" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M36.4582 31.6019L33.5415 38.3978" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

    ),
  },
  {
    title: 'Privacy-First Builder',
    description: 'Building confidential DeFi, payments, or identity apps from scratch.',
    link: '/horizen-chain/privacy-tools',
    cta: 'Explore Privacy Tools',
    icon: (
      <svg width="48" height="48" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="70" height="70" rx="14" fill="#1038BB" />
        <path d="M32.7981 20.752L25.5211 23.4937C23.844 24.1208 22.4731 26.1041 22.4731 27.8833V38.7187C22.4731 40.4395 23.6106 42.6999 24.9961 43.7354L31.2669 48.4166C33.3231 49.9624 36.7065 49.9624 38.7627 48.4166L45.0336 43.7354C46.419 42.6999 47.5565 40.4395 47.5565 38.7187V27.8833C47.5565 26.0895 46.1856 24.1062 44.5086 23.4791L37.2315 20.752C35.9919 20.2999 34.0086 20.2999 32.7981 20.752Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M30.6978 34.8104L33.0457 37.1583L39.3165 30.8875" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

    ),
  },
  {
    title: 'Compliance Engineer',
    description: 'Gate contract actions behind AML verification for regulated markets. No new toolchain needed.',
    link: '/horizen-chain/compliance',
    cta: 'Explore Compliance Patterns',
    icon: (
      <svg width="48" height="48" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="70" height="70" rx="14" fill="#1038BB" />
        <path d="M31.0771 38.9375L33.2646 41.125L39.098 35.2916" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M33.4832 20.4166H32.0832C30.6248 20.4166 29.1665 20.4166 29.1665 23.3333C29.1665 26.25 30.6248 26.25 32.0832 26.25H37.9165C40.8332 26.25 40.8332 24.7916 40.8332 23.3333C40.8332 20.4166 39.3748 20.4166 37.9165 20.4166" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M21.875 32.0834C21.875 25.4334 24.3104 23.625 29.1667 23.3625" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M40.8333 23.3625C45.6896 23.625 48.125 25.4188 48.125 32.0834V40.8334C48.125 46.6667 46.6667 49.5834 39.375 49.5834H30.625C23.3333 49.5834 21.875 46.6667 21.875 40.8334V37.7855" stroke="white" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

    ),
  },
];

function PersonaCards() {
  return (
    <section className="w-full px-24 py-24 bg-[#F4F4F4] [html[data-theme='dark']_&]:bg-[#030E24] max-[1100px]:px-10 max-[900px]:px-5 max-[900px]:py-14">
      <div className="text-[clamp(2rem,4vw,3rem)] font-extrabold mb-10 text-[#030E24] [html[data-theme='dark']_&]:text-white" style={{ fontFamily: "'Funnel Display', sans-serif" }}>Choose Your Path</div>
      <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
        {personas.map((p) => (
          <div
            key={p.title}
            className={
              "flex flex-col gap-4 p-8 rounded-xl border " +
              "bg-white border-[#e5e7eb] shadow-sm " +
              "[html[data-theme='dark']_&]:bg-[#0d1b2e] [html[data-theme='dark']_&]:border-[#1e2d42]"
            }
          >
            <div className="w-12 h-12 shrink-0 mb-3">{p.icon}</div>
            <div className="text-xl font-bold text-[#030E24] [html[data-theme='dark']_&]:text-white">{p.title}</div>
            <div className="text-sm leading-relaxed text-[#374151] [html[data-theme='dark']_&]:text-[#a8b8cc] flex-1 -mt-2">
              {p.description}
            </div>
            <div className="mt-0">
              <Link
                to={p.link}

              >
                <button
                  className={
                    "inline-block border-none bg-[#FECB17] text-black font-bold text-sm px-6 py-3 rounded-full " +
                    "hover:bg-[#e6bc17] no-underline! transition-colors duration-150"
                  }
                >
                  {p.cta}
                </button>

              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Quick Setup ───────────────────────────────────────────────────────── */
const quickSetupItems = [
  { label: 'Add Horizen to Your Wallet', link: '/horizen-chain/network/mainnet' },
  { label: 'Get Testnet ETH from the Faucet', link: '/horizen-chain/network/testnet' },
  { label: 'View the Block Explorer', link: '/horizen-chain/network/block-explorer' },
];

function QuickSetup() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className={styles.quickSetupSection}>
      <div className={`${styles.quickSetupGrid} grid grid-cols-[minmax(260px,1fr)_2fr] items-start gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-8`}>
        <h2 className={`${styles.sectionHeading} ${styles.quickSetupHeading}`}>Quick Setup</h2>
        <div className={styles.quickSetupList}>
          {quickSetupItems.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className={`${styles.quickSetupRow} ${active === i ? styles.quickSetupRowActive : ''}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <span className={styles.quickSetupNum}>0{i + 1}</span>
              <span className={styles.quickSetupLabel}>{item.label}</span>
              <span className={`${styles.quickSetupIndicator} ${active === i ? styles.quickSetupIndicatorActive : ''}`} aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="8 7 17 7 17 16" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function StartBuilding() {
  return (
    <section className={"w-full px-24 py-24 max-[1100px]:px-10 max-[900px]:px-5 max-[900px]:py-14"}>
      <div className={"text-[clamp(2rem,4vw,3rem)] font-extrabold mb-10 text-[#030E24] [html[data-theme='dark']_&]:text-white"} style={{ fontFamily: "'Funnel Display', sans-serif" }}>Start Building</div>
      <div className={"grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 pt-5"}>
        {buildingCards.map((card) => (
          <div
            className={
              "flex flex-col  p-5 rounded-xl border border-transparent " +
              "bg-white shadow-sm [html[data-theme='dark']_&]:bg-[#0d1b2e] [html[data-theme='dark']_&]:border-[#1e2d42] " +
              "[html:not([data-theme='dark'])_&]:border-[#e5e7eb]"
            }
            key={card.title}
          >
            <span className={"text-xs font-semibold tracking-widest uppercase text-[#6b7280] [html[data-theme='dark']_&]:text-[#8b9ab0] mb-2"}>
              #{card.tag}
            </span>
            <h3 className={"text-xl font-bold leading-snug m-0 [html[data-theme='dark']_&]:text-white"}>
              {card.title}
            </h3>
            <p className={"text-sm leading-relaxed text-[#374151] [html[data-theme='dark']_&]:text-[#a8b8cc] m-0 flex-1"}>
              {card.description}
            </p>
            <div className={"mt-0"}>
              <Link to={card.link}>
                <button
                  className={"inline-block bg-[#FECB17] text-black font-bold border-none text-sm px-6 py-3 rounded-full " +
                    "hover:bg-[#e6bc17] no-underline! transition-colors duration-150"}>
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Newsletter ────────────────────────────────────────────────────────── */
function Newsletter() {
  return (
    <section className="w-full min-h-52 bg-[rgba(254,203,23,1)] flex items-center px-25 py-12.5 max-[1100px]:px-10 max-[860px]:px-6 max-[860px]:py-10">
      <div className="flex items-center justify-between gap-17.75 w-full max-[860px]:flex-col max-[860px]:items-start max-[860px]:gap-6">
        <span className="text-[#030E24] font-extrabold text-[clamp(1.75rem,2.4vw,2.5rem)] whitespace-nowrap leading-[1.1] tracking-tight shrink-0" style={{ fontFamily: "'Funnel Display', sans-serif" }}>
          Sign Up for Newsletter
        </span>
        <div className="flex items-center gap-10 flex-1 justify-end max-[860px]:w-full max-[860px]:flex-col max-[860px]:items-stretch max-[860px]:gap-5">
          <input
            type="text"
            placeholder="Name"
            className="bg-transparent border-0 border-b border-[#030E24] text-[#030E24] placeholder:text-[#030E24] placeholder:font-medium text-base outline-none w-60 py-2 rounded-none shadow-none focus:border-b-2 max-[860px]:w-full"
            aria-label="Name"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="bg-transparent border-0 border-b border-[#030E24] text-[#030E24] placeholder:text-[#030E24] placeholder:font-medium text-base outline-none w-60 py-2 rounded-none shadow-none focus:border-b-2 max-[860px]:w-full"
            aria-label="Email address"
          />
          <button type="button" className="bg-white text-[#030E24] font-bold text-base px-10 py-4 rounded-full whitespace-nowrap min-w-40 cursor-pointer hover:bg-gray-50 border-none hover:shadow-md transition-all max-[860px]:w-full">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main>
        <Hero />
        <div className={styles.heroSpacer} />
        {/* <WhatIsHorizen /> */}
        <L3Banner />
        <PersonaCards />
        <QuickSetup />
        <StartBuilding />
        <Newsletter />
      </main>
    </Layout>
  );
}
