'use client';
import React from 'react';
import {
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import AirDrop from '@/components/airdrop';
import SignMessage from '@/components/signmessage';
import SendSol from '@/components/sendsol';
import TokenButton from '@/components/tokenbutton';
function AdapterPage() {
    return (
        <ConnectionProvider endpoint={'https://api.devnet.solana.com'}>
            <WalletProvider wallets={[]} autoConnect>
                <WalletModalProvider>
                    <div className='flex gap-10 mb-5'>
                        <WalletMultiButton />
                        <WalletDisconnectButton />
                    </div>
                    <AirDrop />
                    <div className='flex gap-20'>
                        <SignMessage />
                        <SendSol />
                        <TokenButton />
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
export default AdapterPage;
