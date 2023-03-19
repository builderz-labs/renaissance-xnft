import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios";

export const truncate = (wallet: string, startChars: any, endChars: number) => {
  var start = wallet.substring(0, startChars);
  var end = wallet.substring(wallet.length - endChars, wallet.length);
  return start + "..." + end;
};

const fetchTransactionPages = async (amount?: number, timestamp?: number) => {
  let oldestTransaction = "";
  let transactions: any[] = [];

  let oldestTransactionTimestamp = Infinity;
  let maxTxAmount = amount || Infinity;
  let maxTxTimestamp = timestamp || Infinity;

  try {
    while (
      transactions.length <= maxTxAmount &&
      oldestTransactionTimestamp >= maxTxTimestamp
    ) {
      const url = `${
        import.meta.env.VITE_HELIUS_RPC_PROXY
      }/v0/addresses/9ZskGH9wtdwM9UXjBq1KDwuaLfrZyPChz41Hx7NWhTFf/transactions?before=${oldestTransaction}`;
      const { data } = await axios.get(url);

      if (data.length === 0) {
        // Exhausted all transactions for the given address
        return transactions;
      }

      oldestTransaction = data[data.length - 1].signature;

      oldestTransactionTimestamp = data[data.length - 1].timestamp * 1000;

      const timeFilteredData = data.filter(
        (tx: any) => tx.timestamp * 1000 >= maxTxTimestamp
      );

      if (timeFilteredData.length === 0) {
        return transactions;
      }

      transactions.push(...timeFilteredData);
    }

    return transactions;
  } catch (error) {
    throw error;
  }
};

// TODO: Figure out how to create Collections Leaderboard

// export const getCollectionLeaderboard = async (collections: string[]) => {
//   const date = Date.now();

//   const transactions = await fetchTransactionPages(
//     undefined,
//     date - 30 * 24 * 60 * 60 * 1000
//   );

//   const readingMints = transactions.map((tx: any) => {
//     console.log(tx);

//     tx.instructions.forEach((ix: any) => {
//       return { ...ix.accounts.slice(1) };
//     });
//   });

//   console.log(readingMints);

//   const filtered: Array<any> = [];

//   return [];
// };

// export const fetchHistory = async (nftToFilterBy?: PublicKey) => {
//   const data = await fetchTransactionPages(2000);

//   const filtered: Array<any> = [];

//   data &&
//     data.forEach((tx: any) => {
//       // Filter each instruction
//       const filteredInstructions = tx.instructions.filter((ix: any) => {
//         if (true) {
//           // nftList.includes(ix.accounts[1])
//           return ix;
//         }
//       });

//       const royaltyAccounts = filteredInstructions[0].accounts.slice(6);
//       const royaltyTransfers = tx.nativeTransfers.filter((transfer: any) =>
//         royaltyAccounts.includes(transfer.toUserAccount)
//       );
//       let amount = 0;
//       royaltyTransfers.forEach((transfer: any) => {
//         amount += transfer.amount;
//       });

//       filtered.push({
//         nft:
//           truncate(filteredInstructions[0].accounts[1], 4, 4) +
//           ` (${filteredInstructions.length})`,
//         wallet: truncate(tx.feePayer, 4, 4),
//         amount: amount / LAMPORTS_PER_SOL,
//         date: tx.timestamp * 1000,
//         signature: tx.signature,
//         key: tx.signature,
//       });
//     });

//   return filtered;
// };

// // History for user
// export const fetchUserHistory = async (user: PublicKey) => {
//   const transactions = await fetchTransactionPages(2000);

//   const userTransactions = transactions?.filter((tx: any) => {
//     return tx.feePayer === user.toBase58();
//   });

//   // TODO: return more detailed with collection info

//   let userTotalAmount = 0;

//   userTransactions?.forEach((tx: any) => {
//     const filteredInstructions = tx.instructions.filter((ix: any) => {
//       if (true) {
//         // nftList.includes(ix.accounts[1])
//         // More filters
//         return ix;
//       }
//     });
//     const royaltyAccounts = filteredInstructions[0].accounts.slice(6);
//     const royaltyTransfers = tx.nativeTransfers.filter((transfer: any) =>
//       royaltyAccounts.includes(transfer.toUserAccount)
//     );

//     const transactionTotalAmount = royaltyTransfers.reduce(
//       (acc: any, curr: any) => {
//         return acc + curr.amount;
//       }
//     );

//     userTotalAmount += transactionTotalAmount;
//   });

//   return { totalAmount: userTotalAmount, transactions: userTransactions };
// };

// Leaderboard
export const fetchLeaderboard = async () => {
  const date = Date.now();

  const transactions = await fetchTransactionPages(
    undefined,
    date - 7 * 24 * 60 * 60 * 1000
  );

  const uniqueUsers = [...new Set(transactions.map((tx: any) => tx.feePayer))];

  const leaderboard = uniqueUsers.map((user: any) => {
    const userTransactions = transactions.filter((tx: any) => {
      return tx.feePayer === user;
    });

    let userTotal = 0;

    userTransactions.forEach((tx: any) => {
      let royaltyAccounts: string[] = [];
      tx.instructions.forEach((ix: any) => {
        royaltyAccounts.push(...ix.accounts.slice(6));
      });

      const royaltyTransfers = tx.nativeTransfers.filter((transfer: any) =>
        royaltyAccounts.includes(transfer.toUserAccount)
      );

      const transactionTotalAmount = royaltyTransfers.reduce(
        (acc: any, curr: any) => {
          return acc + curr.amount;
        },
        0
      );

      userTotal += transactionTotalAmount;
    });

    userTotal = userTotal / LAMPORTS_PER_SOL;

    return { user, total: userTotal };
  });

  return leaderboard.sort((a: any, b: any) => b.total - a.total);
};
