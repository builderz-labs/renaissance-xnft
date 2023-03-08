import { PublicKey } from '@solana/web3.js';
import { getMerkleProof, Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js';
import { useConnection } from '@solana/wallet-adapter-react';
import { useWallet } from '../hooks/useWallet';
import { useState } from 'react';

export const MintButton = () => {
    const [loading, setLoading] = useState(false)
    const { connection } = useConnection();
    const wallet = useWallet();

    const onClick = async () => {
        // const allowList = await (await fetch("/allowList.json")).json()

        if (!wallet.publicKey) {
            console.log('error', 'Wallet not connected!');
            return;
        }

        // if (!allowList.includes(wallet.publicKey.toBase58())) {
        //     toast.error("You're not on the allowlist");
        //     return;
        // }

        setLoading(true)

        const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet))
        const candyMachineAddress = new PublicKey("8Z1r48UAvmghrYP23hCr18tN7cRhcEEafSAWnnWpms7K");
        
        const cm = await metaplex.candyMachines().findByAddress({ address: candyMachineAddress });

        let res;
            
        try {
            // await metaplex.candyMachines().callGuardRoute({
            //     candyMachine: cm,
            //     guard: "allowList",
            //     settings: {
            //         path: "proof",
            //         merkleProof: getMerkleProof(allowList, metaplex.identity().publicKey.toBase58())
            //     }
            // })

            res = await metaplex.candyMachines().mint({
                candyMachine: cm,
                collectionUpdateAuthority: new PublicKey("PeRXuY1P4cnzDZEPH1ancRVSyQMDpnTF27BwmQ1kkWq")
            })
        } catch (error) {
            console.log(error);
            setLoading(false)
            return;
        }

        console.log(res);

        setLoading(false)
    }

    return (
      <button
          className={"px-8 btn btn-block border-none animate-pulse bg-gradient-to-r from-[#67aafc] to-[#ee982f] hover:from-pink-500 hover:to-yellow-500 " + (loading && " loading")}
          onClick={() => onClick()}
      >
          <span>Mint</span>
      </button>
    );
};