import { BN, web3 } from "@project-serum/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Commitment,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  GetProgramAccountsConfig,
} from "@solana/web3.js";
import { Metadata, PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getMint,
} from "@solana/spl-token";
import { StakingOptions } from "@dual-finance/staking-options";
import { GSO } from "@dual-finance/gso";
import { GsoBalanceParams, GsoParams, SoBalanceParams } from "../types";
import { queryClient } from "../client";
import { BONK_MINT_MAINNET } from "../config";

export async function stakeGso(
  { soName, base, option, gsoStatePk }: GsoParams,
  amount: number,
  connection: Connection,
  wallet: WalletContextState
) {
  if (!wallet.publicKey) {
    return;
  }

  const [userBaseAccount, userOptionAccount] = await Promise.all([
    getAssociatedTokenAddress(base, wallet.publicKey),
    getAssociatedTokenAddress(option, wallet.publicKey),
  ]);

  const transaction = new web3.Transaction();
  if (!(await connection.getAccountInfo(userOptionAccount))) {
    transaction.add(
      createAssociatedTokenAccountInstr(
        userOptionAccount,
        option,
        wallet.publicKey,
        wallet.publicKey
      )
    );
  }
  const gso = new GSO(connection.rpcEndpoint);
  const xBaseMint = await gso.xBaseMint(gsoStatePk);
  const userXBaseMintAccount = await getAssociatedTokenAddress(
    xBaseMint,
    wallet.publicKey
  );
  if (!(await connection.getAccountInfo(userXBaseMintAccount))) {
    transaction.add(
      createAssociatedTokenAccountInstr(
        userXBaseMintAccount,
        xBaseMint,
        wallet.publicKey,
        wallet.publicKey
      )
    );
  }
  const stakeInstruction = await gso.createStakeInstruction(
    amount,
    soName,
    wallet.publicKey,
    base,
    userBaseAccount
  );
  transaction.add(stakeInstruction);
  // @ts-ignore
  const signature = await wallet.sendAndConfirm(transaction);

  return signature;
}

export async function unstakeGSO(
  { soName, base }: GsoBalanceParams,
  amount: number,
  connection: Connection,
  wallet: WalletContextState
) {
  if (!wallet.publicKey) {
    return;
  }

  const userBaseAccount = await getAssociatedTokenAddress(
    base,
    wallet.publicKey
  );

  const transaction = new web3.Transaction();
  await checkBurnedAccount(
    transaction,
    connection,
    userBaseAccount,
    base,
    wallet.publicKey
  );
  const gso = new GSO(connection.rpcEndpoint);
  const unstakeInstruction = await gso.createUnstakeInstruction(
    amount,
    soName,
    wallet.publicKey,
    userBaseAccount
  );

  transaction.add(unstakeInstruction);

  // TODO: Enable once figured out why not all of the amount got unstaked.
  // const gsoState = await gso.state(soName);
  // const xBaseMint = await gso.xBaseMint(gsoState);
  // const userXTokenAccount = await getAssociatedTokenAddress(xBaseMint, provider.publicKey);
  // transaction.add(createCloseAccountInstruction(userXTokenAccount, provider.publicKey, provider.publicKey));

  // @ts-ignore
  const signature = await wallet.sendAndConfirm(transaction);

  return signature;
}

export async function exerciseSO(
  { soName, base, quote, option, strikeAtomsPerLot }: SoBalanceParams,
  amount: number,
  connection: Connection,
  wallet: WalletContextState,
  _swapQty?: number
) {
  if (!wallet.publicKey) {
    return;
  }

  const [userSoAccount, userQuoteAccount, userBaseAccount] = await Promise.all([
    getAssociatedTokenAddress(option, wallet.publicKey),
    getAssociatedTokenAddress(quote, wallet.publicKey),
    getAssociatedTokenAddress(base, wallet.publicKey),
  ]);

  const transaction = new web3.Transaction();
  await checkBurnedAccount(
    transaction,
    connection,
    userBaseAccount,
    base,
    wallet.publicKey
  );
  const so = new StakingOptions(connection.rpcEndpoint);
  const exerciseInstruction = await so.createExerciseInstruction(
    new BN(amount),
    strikeAtomsPerLot,
    soName,
    wallet.publicKey,
    userSoAccount,
    userQuoteAccount,
    userBaseAccount
  );
  transaction.add(exerciseInstruction);
  // @ts-ignore
  const signature = await wallet.sendAndConfirm(transaction);

  return signature;
}

// Required for unstake/exercise since SDK uses getAccount() & user may have burned account
async function checkBurnedAccount(
  tx: Transaction,
  connection: Connection,
  userAccount: PublicKey,
  mint: PublicKey,
  publicKey: PublicKey
) {
  if (!(await connection.getAccountInfo(userAccount))) {
    const createAccnt = createAssociatedTokenAccountInstr(
      userAccount,
      mint,
      publicKey,
      publicKey
    );
    tx.add(createAccnt);
  }
}

function createAssociatedTokenAccountInstr(
  pubKey: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  payer: PublicKey
) {
  const data = Buffer.alloc(0);
  const keys = [
    {
      pubkey: payer,
      isSigner: true,
      isWritable: true,
    },
    {
      pubkey: pubKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: owner,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: mint,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  const instr = new TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data,
  });
  return instr;
}

let connection: Connection;
export function getConnection(commitment: Commitment = "confirmed") {
  if (!connection) {
    connection = new Connection(
      import.meta.env.VITE_HELIUS_RPC_PROXY,
      commitment
    );
  }
  return connection;
}

async function getMetadataPDA(mint: PublicKey) {
  const [publicKey] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), PROGRAM_ID.toBuffer(), mint.toBuffer()],
    PROGRAM_ID
  );
  return publicKey;
}

async function getTokenMetadata(connection: Connection, baseMint: PublicKey) {
  const pda = await getMetadataPDA(baseMint);
  const metadata = await Metadata.fromAccountAddress(connection, pda);
  const uri = metadata.data.uri.replace(/\0.*$/g, "");
  const data = await fetch(uri);
  const json = await data.json();
  return json;
}

export async function fetchTokenMetadata(
  connection: Connection,
  baseMint: PublicKey
) {
  const data = queryClient.fetchQuery({
    queryKey: ["metadata", baseMint.toBase58()],
    queryFn: () => getTokenMetadata(connection, baseMint),
  });
  return data;
}

export async function fetchMint(connection: Connection, mint: PublicKey) {
  const data = queryClient.fetchQuery({
    queryKey: ["getMint", mint.toBase58()],
    queryFn: () => getMint(connection, mint),
  });
  return data;
}

export async function fetchProgramAccounts(
  connection: Connection,
  pk: PublicKey,
  config?: GetProgramAccountsConfig
) {
  const data = queryClient.fetchQuery({
    queryKey: ["getProgramAccounts", pk.toBase58(), config],
    queryFn: () => connection.getProgramAccounts(pk, config),
  });
  return data;
}

export function readBigUInt64LE(buffer: Buffer, offset = 0) {
  const first = buffer[offset];
  const last = buffer[offset + 7];
  if (first === undefined || last === undefined) {
    throw new Error();
  }
  const lo =
    first +
    buffer[++offset] * 2 ** 8 +
    buffer[++offset] * 2 ** 16 +
    buffer[++offset] * 2 ** 24;
  const hi =
    buffer[++offset] +
    buffer[++offset] * 2 ** 8 +
    buffer[++offset] * 2 ** 16 +
    last * 2 ** 24;
  return BigInt(lo) + (BigInt(hi) << BigInt(32));
}

export function parseGsoState(buf: Buffer) {
  const periodNum = Number(readBigUInt64LE(buf, 8));
  const subscriptionPeriodEnd = Number(readBigUInt64LE(buf, 16));
  const lockupRatioTokensPerMillion = Number(readBigUInt64LE(buf, 24));
  const gsoStateBump = Number(buf.readUInt8(32));
  const soAuthorityBump = Number(buf.readUInt8(33));
  const xBaseMintBump = Number(buf.readUInt8(34));
  const baseVaultBump = Number(buf.readUInt8(35));
  const strike = Number(readBigUInt64LE(buf, 36));
  const soNameLengthBytes = Number(buf.readUInt8(44));
  const soName = String.fromCharCode.apply(
    String,
    // @ts-ignore
    buf.slice(48, 48 + soNameLengthBytes)
  );
  const soStateOffset = 48 + soNameLengthBytes;
  const stakingOptionsState = new PublicKey(
    buf.slice(soStateOffset, soStateOffset + 32)
  );
  const authority = new PublicKey(
    buf.slice(soStateOffset + 32, soStateOffset + 32 + 32)
  );
  let baseMint = new PublicKey(
    buf.slice(soStateOffset + 64, soStateOffset + 64 + 32)
  );
  if (baseMint.toBase58() === "11111111111111111111111111111111") {
    // Backwards compatibility hack.
    baseMint = new PublicKey(BONK_MINT_MAINNET);
  }
  let lockupPeriodEnd = Number(
    readBigUInt64LE(buf.slice(soStateOffset + 96, soStateOffset + 96 + 32))
  );
  if (lockupPeriodEnd === 0) {
    // Backwards compatibility hack for subscription period
    lockupPeriodEnd = subscriptionPeriodEnd;
  }
  return {
    periodNum,
    subscriptionPeriodEnd,
    lockupRatioTokensPerMillion,
    gsoStateBump,
    soAuthorityBump,
    xBaseMintBump,
    baseVaultBump,
    strike,
    soNameLengthBytes,
    soName,
    stakingOptionsState,
    authority,
    baseMint,
    lockupPeriodEnd,
  };
}

export async function getMultipleTokenAccounts(
  connection: Connection,
  keys: string[],
  commitment: string
) {
  if (keys.length > 100) {
    const batches: string[][] = chunks(keys, 100);
    const batchesPromises: Promise<{ keys: string[]; array: any }>[] =
      batches.map((batch: string[]) => {
        const result: Promise<{ keys: string[]; array: any }> =
          getMultipleAccountsCore(connection, batch, commitment, "jsonParsed");
        return result;
      });
    const results: { keys: string[]; array: any }[] = await Promise.all<{
      keys: string[];
      array: any;
    }>(batchesPromises);
    let allKeys: string[] = [];
    let allArrays: any[] = [];
    results.forEach((result: { keys: string[]; array: any }) => {
      allKeys = allKeys.concat(result.keys);
      allArrays = allArrays.concat(result.array);
    });
    return { keys: allKeys, array: allArrays };
  }

  const result = await getMultipleAccountsCore(
    connection,
    keys,
    commitment,
    "jsonParsed"
  );
  const array = result.array.map((acc: { [x: string]: any; data: any }) => {
    if (!acc) {
      return undefined;
    }
    const { data, ...rest } = acc;
    const obj = {
      ...rest,
      data,
    };
    return obj;
  });
  return { keys, array };
}

function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply(0, new Array(Math.ceil(array.length / size))).map(
    (_, index) => array.slice(index * size, (index + 1) * size)
  );
}

async function getMultipleAccountsCore(
  connection: Connection,
  keys: string[],
  commitment: string | undefined,
  encoding: string | undefined
): Promise<{ keys: string[]; array: any }> {
  if (encoding !== "jsonParsed" && encoding !== "base64") {
    throw new Error();
  }
  const args = connection._buildArgs(
    [keys],
    commitment as Commitment,
    encoding
  );

  // @ts-ignore
  const unsafeRes = await connection._rpcRequest("getMultipleAccounts", args);
  if (unsafeRes.error) {
    throw new Error(
      `failed to get info about account ${unsafeRes.error.message as string}`
    );
  }

  if (unsafeRes.result.value) {
    const array = unsafeRes.result.value;
    return { keys, array };
  }

  throw new Error();
}
