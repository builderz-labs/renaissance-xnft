export type Collection = {
  id: number;
  name: string;
  description: string;
  image: string;
  collectionAddress: string;
  helloMoonCollectionId: string;
  socials: {
    name: string;
    url: string;
  }[];
  fee: number;
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
