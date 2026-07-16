import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const HORIZEN_MAINNET = {
  chainId: '0x6792',
  chainName: 'Horizen Mainnet',
  rpcUrls: ['https://horizen.calderachain.xyz/http'],
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  blockExplorerUrls: ['https://explorer.horizen.io/'],
};

type Status = 'idle' | 'added' | 'no-wallet';

function AddToWalletButtonInner() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleClick() {
    if (!window.ethereum) {
      setStatus('no-wallet');
      return;
    }
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [HORIZEN_MAINNET],
      });
      setStatus('added');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: unknown) {
      if ((err as { code?: number }).code !== 4001) {
        console.error('wallet_addEthereumChain error', err);
      }
      setStatus('idle');
    }
  }

  return (
    <div style={{ margin: '16px 0' }}>
      <button
        onClick={handleClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: status === 'added' ? '#22c55e' : '#f5e642',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '15px',
          cursor: 'pointer',
          transition: 'background 0.2s, opacity 0.2s',
        }}
      >
        {status === 'added' ? '✓ Network added!' : '+ Add Horizen Mainnet to Wallet'}
      </button>
      {status === 'no-wallet' && (
        <p style={{ marginTop: '8px', fontSize: '13px', color: '#aaa' }}>
          No wallet detected. Install{' '}
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
            MetaMask
          </a>{' '}
          and try again.
        </p>
      )}
    </div>
  );
}

export default function AddToWalletButton() {
  return <BrowserOnly>{() => <AddToWalletButtonInner />}</BrowserOnly>;
}
