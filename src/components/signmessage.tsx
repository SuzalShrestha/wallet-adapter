'use client';
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
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import bs58 from 'bs58';
import { ed25519 } from '@noble/curves/ed25519';
import { Loader2, CheckCircle } from 'lucide-react';
function SignMessage() {
    const [message, setMessage] = useState('');
    const [isSigning, setIsSigning] = useState(false);
    const [isSignComplete, setIsSignComplete] = useState(false);
    const [signature, setSignature] = useState('');
    const { publicKey, signMessage } = useWallet();
    const onSignMessage = async () => {
        try {
            if (!message) {
                toast.error('Please enter a message');
                return;
            }
            if (!publicKey) {
                toast.error('Please connect your wallet');
                return;
            }
            if (!signMessage) {
                toast.error('Sign message not supported');
                return;
            }
            setIsSigning(true);
            const encodedMessage = new TextEncoder().encode(message);
            const signedSignature = await signMessage(encodedMessage);
            if (
                !ed25519.verify(
                    signedSignature,
                    encodedMessage,
                    publicKey.toBytes()
                )
            ) {
                toast.error('Invalid signature');
                return;
            }
            setIsSigning(false);
            setIsSignComplete(true);
            setSignature(bs58.encode(signedSignature));
            toast.success(`Message signed: ${bs58.encode(signedSignature)}`);
        } catch {
            toast.error('Error signing message');
        }
    };
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='px-10 py-6 text-md font-semibold bg-[#512DA8]'>
                        Sign Message
                    </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader>
                        <DialogTitle>Sign Message</DialogTitle>
                        <DialogDescription>
                            Sign a message with your wallet
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor='message' className='text-right'>
                                Message
                            </Label>
                            <Input
                                value={message}
                                id='message'
                                placeholder='Enter your message'
                                className='col-span-3'
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => onSignMessage()}>
                            {isSigning ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Signing...
                                </>
                            ) : isSignComplete ? (
                                <>
                                    <CheckCircle className='mr-2 h-4 w-4' />
                                    Signed
                                </>
                            ) : (
                                'Sign Message'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {signature && (
                <div className='flex text-md font-semibold my-5'>
                    <h1>Signature of Your Message: {signature}</h1>
                </div>
            )}
        </>
    );
}

export default SignMessage;
