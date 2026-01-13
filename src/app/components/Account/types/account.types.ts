import { Collection, Model } from "../../Model/types/model.types";

export interface Purchase {
  id: string;
  buyer: string;
  purchaseId: string;
  collectionId: string;
  amount: string;
  tokenIds: string[];
  collection: Collection;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface ModelData {
  title: string;
  image: string | File;
  cover: string | File;
  description: string;
  link: string;
  transferWallet?: string;
}

export type ModelSectionProps = {
  dict: any;
  verified: boolean;
  model: Model | undefined;
};

export type CuentaTabProps = {
  dict: any;
  model: Model | undefined;
  verified: boolean;
};

export type CreateTabProps = {
  dict: any;
  model: Model | undefined;
};
