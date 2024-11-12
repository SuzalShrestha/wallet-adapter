import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
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
    const updateBalance = async () => {
        getBalance().then((balance) => setBalance(balance));
    };
    const sendAirDrop = async () => {
        try {
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
                toast.success('Airdrop sent');
                updateBalance();
            }
        } catch {
            toast.error('Error sending airdrop');
        }
    };
    useEffect(() => {
        updateBalance();
    }, [wallet.connected]);
    return (
        <div className='my-10 flex flex-col gap-10'>
            {wallet.connected && (
                <div className='flex text-5xl font-semibold my-5'>
                    <h1>{balance / LAMPORTS_PER_SOL} SOL </h1>
                </div>
            )}
            {!wallet.connected && (
                <div className='flex text-5xl font-semibold my-5'>
                    <h1>Connect your wallet to get started.</h1>
                </div>
            )}
            <div className='flex gap-10 items-center'>
                <Input
                    className='w-1/2 py-6 font-semibold text-2xl'
                    value={airDropAmount == 0 ? '' : airDropAmount}
                    type='number'
                    onChange={(e) =>
                        setAirDropAmount(
                            e.target.value == '' ? 0 : parseInt(e.target.value)
                        )
                    }
                />
                <Button
                    className='px-10 py-6 text-xl font-semibold bg-[#512DA8]'
                    onClick={() => sendAirDrop()}
                >
                    Airdrop
                </Button>
            </div>
        </div>
    );
}
export default AirDrop;
