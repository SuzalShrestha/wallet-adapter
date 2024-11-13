import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from './ui/label';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
    PublicKey,
} from '@solana/web3.js';
import { toast } from 'sonner';

export default function SendSol() {
    const [toPublicKey, setToPublicKey] = useState('');
    const [amount, setAmount] = useState('');
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const onSendSol = async () => {
        try {
            if (!publicKey) {
                toast.error('Wallet not connected');
                return;
            }
            const transaction = new Transaction();
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(publicKey),
                    toPubkey: new PublicKey(toPublicKey),
                    lamports: LAMPORTS_PER_SOL * parseFloat(amount),
                })
            );
            const signature = await sendTransaction(transaction, connection);
            const latestBlockHash = await connection.getLatestBlockhash();
            await connection.confirmTransaction({
                signature,
                ...latestBlockHash,
            });
            toast.success(`Sent ${amount} SOL to ${toPublicKey}`);
        } catch {
            toast.error('Error sending SOL');
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='px-10 py-6 text-md font-semibold bg-[#512DA8]'>
                    Send Sol
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Send Sol</DialogTitle>
                    <DialogDescription>
                        Send Sol to another address
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='address' className='text-right'>
                            Address
                        </Label>
                        <Input
                            value={toPublicKey}
                            id='address'
                            placeholder='Enter recipient address'
                            className='col-span-3'
                            onChange={(e) => setToPublicKey(e.target.value)}
                        />
                        <Label htmlFor='address' className='text-right'>
                            Amount
                        </Label>
                        <Input
                            value={amount}
                            id='amount'
                            placeholder='Enter amount'
                            className='col-span-3'
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onSendSol()}>Send Sol</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
