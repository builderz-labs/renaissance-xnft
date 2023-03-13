import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import axios from 'axios';

export const truncate = (wallet: string, startChars: any, endChars: number) => {
  var start = wallet.substring(0, startChars);
  var end = wallet.substring(wallet.length - endChars, wallet.length);
  return start + '...' + end;
};

const fetchTransactionPages = async (amount: number) => {
  let page = 1;
  let oldestTransaction = '';
  let transactions: any[] = [];

  try {
    while (transactions.length <= amount) {
      const url = `${process.env.NEXT_PUBLIC_HELIUS_URL}/v0/addresses/9ZskGH9wtdwM9UXjBq1KDwuaLfrZyPChz41Hx7NWhTFf/transactions?before=${oldestTransaction}`;
      const { data } = await axios.get(url);

      if (data.length === 0) {
        // Exhausted all transactions for the given address
        return transactions;
      }

      // API data is already sorted in descending order
      oldestTransaction = data[data.length - 1].signature;
      transactions.push(...data);
      page += 1;
      return transactions;
    }
  } catch (error) {
    throw error;
  }
};

export const fetchHistory = async (nftToFilterBy?: PublicKey) => {
  const data = await fetchTransactionPages(2000);

  const filtered: Array<any> = [];

  data &&
    data.forEach((tx: any) => {
      // Filter each instruction
      const filteredInstructions = tx.instructions.filter((ix: any) => {
        if (true) {
          // nftList.includes(ix.accounts[1])
          return ix;
        }
      });

      const royaltyAccounts = filteredInstructions[0].accounts.slice(6);
      const royaltyTransfers = tx.nativeTransfers.filter((transfer: any) =>
        royaltyAccounts.includes(transfer.toUserAccount)
      );
      let amount = 0;
      royaltyTransfers.forEach((transfer: any) => {
        amount += transfer.amount;
      });

      filtered.push({
        nft:
          truncate(filteredInstructions[0].accounts[1], 4, 4) +
          ` (${filteredInstructions.length})`,
        wallet: truncate(tx.feePayer, 4, 4),
        amount: amount / LAMPORTS_PER_SOL,
        date: tx.timestamp * 1000,
        signature: tx.signature,
        key: tx.signature,
      });
    });

  return filtered;
};

export const fetchUserHistory = async (user: PublicKey) => {
  const transactions = await fetchTransactionPages(2000);

  const userTransactions = transactions?.filter((tx: any) => {
    return tx.feePayer === user.toBase58();
  });

  // TODO: return more detailed with collection info

  let userTotalAmount = 0;

  userTransactions?.forEach((tx: any) => {
    const filteredInstructions = tx.instructions.filter((ix: any) => {
      if (true) {
        // nftList.includes(ix.accounts[1])
        // More filters
        return ix;
      }
    });
    const royaltyAccounts = filteredInstructions[0].accounts.slice(6);
    const royaltyTransfers = tx.nativeTransfers.filter((transfer: any) =>
      royaltyAccounts.includes(transfer.toUserAccount)
    );

    const transactionTotalAmount = royaltyTransfers.reduce(
      (acc: any, curr: any) => {
        return acc + curr.amount;
      }
    );

    userTotalAmount += transactionTotalAmount;
  });

  return { totalAmount: userTotalAmount, transactions: userTransactions };
};
