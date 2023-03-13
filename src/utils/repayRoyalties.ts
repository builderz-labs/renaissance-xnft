import {
  PROGRAM_ID,
  createRepayRoyaltiesInstruction,
} from '@builderz/royalty-solution';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { NftType } from '../data/types';

export const tryFn = async (fn: any) => {
  try {
    return await fn;
  } catch (error) {
    return null;
  }
};

export const repayRoyalties = async (
  nfts: NftType[],
  connection: Connection,
  wallet: WalletContextState
) => {
  const txInstructions = [];
  const readyTransactions: Transaction[] = [];

  const mintAddresses = nfts.map(nft => nft.tokenAddress);

  const url = `${import.meta.env.VITE_HELIUS_RPC_PROXY}/v0/token-metadata`;

  const { data } = await tryFn(
    await axios.post(url, {
      mintAccounts: mintAddresses,
      includeOffChainData: false,
    })
  );

  const combinedArray = nfts.map((nft: any) => {
    const matchingResult = data.find(
      (metadata: any) =>
        metadata.onChainMetadata.metadata.mint === nft.tokenAddress
    );
    return { ...nft, ...matchingResult };
  });

  for (const nft of combinedArray) {
    // Get Creators
    const creators = nft.onChainMetadata.metadata.data.creators;
    const remainingAccounts: Array<{
      pubkey: PublicKey;
      isWritable: boolean;
      isSigner: boolean;
    }> = [];
    creators.forEach((creator: any) => {
      remainingAccounts.push({
        pubkey: new PublicKey(creator.address),
        isWritable: true,
        isSigner: false,
      });
    });

    // Program action
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata'),
        new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s').toBuffer(),
        new PublicKey(nft.mint).toBuffer(),
      ],
      new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
    );

    const [nftStateAddress] = PublicKey.findProgramAddressSync(
      // @ts-ignore
      [Buffer.from('nft-state'), new PublicKey(nft.mint).toBuffer()],
      PROGRAM_ID
    );

    txInstructions.push(
      createRepayRoyaltiesInstruction(
        {
          nftState: nftStateAddress,
          // @ts-ignore
          nftMint: new PublicKey(nft.mint),
          nftMintMetadata: metadataAddress,
          user: wallet.publicKey!,
          anchorRemainingAccounts: remainingAccounts,
        },
        {
          royaltiesToPay: nft.royaltiesToPay,
        }
      )
    );
  }

  const batchSize = 4;
  const numTransactions = Math.ceil(txInstructions.length / batchSize); // How many instructions can fit?

  for (let i = 0; i < numTransactions; i++) {
    let bulkTransaction = new Transaction();
    let lowerIndex = i * batchSize;
    let upperIndex = (i + 1) * batchSize;
    for (let j = lowerIndex; j < upperIndex; j++) {
      // @ts-ignore
      if (txInstructions[j] && txInstructions[j].length) {
        // @ts-ignore
        bulkTransaction.add(txInstructions[j][0]);
        // @ts-ignore
        bulkTransaction.add(txInstructions[j][1]);
      } else if (txInstructions[j]) {
        bulkTransaction.add(txInstructions[j]);
      }
    }
    readyTransactions.push(bulkTransaction);
  }

  // Send transactions
  try {
    const blockhash = await connection.getLatestBlockhash();

    readyTransactions.forEach(tx => {
      tx.feePayer = wallet.publicKey!;
      tx.recentBlockhash = blockhash.blockhash;
    });

    const transactionsToSend = await wallet.signAllTransactions!(
      readyTransactions
    );

    const promises = transactionsToSend.map(async tx => {
      console.log(tx);

      return await connection.sendRawTransaction(tx.serialize());
    });

    const sigs = await Promise.all(promises);

    const promises2 = sigs.map(async sig => {
      return await connection.confirmTransaction({
        signature: sig,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight,
      });
    });

    const txConfirmations = await Promise.allSettled(promises2);

    return txConfirmations;
  } catch (error) {
    console.log(error);
  }
};
