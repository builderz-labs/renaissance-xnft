export type Collection = {
  id: number;
  name: string;
  image: string;
  collectionAddress: string;
  fp: number;
  sol: number;
};

export type NftType = {
  name: string;
  tokenAddress: string;
  collectionAddress: string;
  collectionName: string;
  imageUrl: string;
  traits: {
    trait_type: string;
    value: string;
  }[];
  royaltiesPaid: boolean;
  royaltiesToPay: number;
};
