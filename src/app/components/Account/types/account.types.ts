import { Collection, Designer, Model } from "../../Model/types/model.types";

export interface CollectionDraft {
  amount: number;
  price: string;
  designerIds: string[];
  metadata: {
    title: string;
    description: string;
    media: File;
    model: string;
    prompt: string;
    workflow: string;
  };
}

export interface DropDraft {
  title: string;
  description: string;
  image: File;
}

export interface CreateCollectionParams {
  edition: bigint;
  price: bigint;
  uri: string;
  designerIds: bigint[];
}

export type DesignerSelectProps = {
  dict: any;
  designers: Designer[];
  designersLoading: boolean;
  selected: string[];
  onChange: (designerIds: string[]) => void;
};

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
