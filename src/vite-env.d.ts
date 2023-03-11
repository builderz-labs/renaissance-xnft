/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HELIUS_RPC_PROXY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "tw-elements" {}
