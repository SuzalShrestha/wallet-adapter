'use client';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { TOKEN_PROGRAM_ID, AccountLayout } from '@solana/spl-token';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function TokenButton() {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const [accountData, setAccountData] = useState([]);
    const getToken = async () => {
        try {
            if (!publicKey) return;
            if (!connection) return;
            if (accountData.length > 0) return;
            const tokenAccounts = await connection.getTokenAccountsByOwner(
                new PublicKey(publicKey),
                {
                    programId: TOKEN_PROGRAM_ID,
                }
            );
            tokenAccounts.value.forEach((tokenAccount) => {
                const accountData = AccountLayout.decode(
                    tokenAccount.account.data
                );
                setAccountData((prev) => {
                    return [
                        ...prev,
                        {
                            mint: new PublicKey(accountData.mint),
                            amount:
                                Number(accountData.amount) / LAMPORTS_PER_SOL,
                        },
                    ];
                });
            });
        } catch {
            toast.error('Error getting token');
        }
    };
    return (
        <div>
            <Button
                className='px-10 py-6 text-md font-semibold bg-[#512DA8]'
                onClick={() => getToken()}
            >
                Get Token
            </Button>
            <div>
                {accountData &&
                    accountData.map((account) => (
                        <div
                            key={account.mint.toString()}
                            className='font-bold text-xl p-2'
                        >
                            {account.mint.toString()} - {account.amount}
                        </div>
                    ))}
            </div>
        </div>
    );
}
export default TokenButton;
