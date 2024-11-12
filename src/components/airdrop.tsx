import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Input } from './ui/input';
import { Button } from './ui/button';
function AirDrop() {
    const [balance, setBalance] = useState(0);
    const [airDropAmount, setAirDropAmount] = useState(0);
    const wallet = useWallet();
    const { connection } = useConnection();
    const getBalance = async () => {
        if (wallet.connected && wallet.publicKey) {
            const balance = await connection.getBalance(wallet?.publicKey);
            return balance;
        }
        return 0;
    };
    const sendAirDrop = async () => {
        if (wallet.connected && wallet.publicKey) {
            const signature = await connection.requestAirdrop(
                wallet.publicKey,
                airDropAmount * LAMPORTS_PER_SOL
            );
            const latestBlockHash = await connection.getLatestBlockhash();
            await connection.confirmTransaction({
                signature,
                ...latestBlockHash,
            });
        }
    };
    useEffect(() => {
        getBalance().then((balance) => setBalance(balance));
    }, [wallet.connected]);
    return (
        <div className='my-5 flex flex-col gap-10'>
            {wallet.connected && (
                <div className='flex text-5xl font-semibold'>
                    <h1>{balance / LAMPORTS_PER_SOL} SOL </h1>
                </div>
            )}
            {!wallet.connected && (
                <div className='flex text-5xl font-semibold'>
                    <h1>Connect your wallet to get started.</h1>
                </div>
            )}
            <div className='flex gap-10 items-center'>
                <Input
                    className='w-1/2'
                    value={airDropAmount == 0 ? '' : airDropAmount}
                    onChange={(e) =>
                        setAirDropAmount(
                            e.target.value == ''
                                ? 0
                                : parseFloat(e.target.value)
                        )
                    }
                />
                <Button onClick={() => sendAirDrop()}>Send AIRDROP</Button>
            </div>
        </div>
    );
}
export default AirDrop;
