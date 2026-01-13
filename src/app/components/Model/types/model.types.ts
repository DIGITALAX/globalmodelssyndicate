export interface Model {
  wallet: string;
  modelId: string;
  w3fReceived: string;
  lastActivity: string;
  totalSales: string;
  uniqueBuyers: string;
  uri: string;
  metadata: DesignerMetadata;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  drops: Drop[];
}

export interface Drop {
  dropId: string;
  modelId: string;
  uri: string;
  metadata: DropMetadata;
  modelProfile: Designer;
  collections: Collection[];
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface Designer {
  wallet: string;
  designerId: string;
  w3fReceived: string;
  lastActivity: string;
  totalSales: string;
  uniqueBuyers: string;
  uri: string;
  metadata: DesignerMetadata;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  drops: Drop[];
}

export interface DesignerMetadata {
  title: string;
  description: string;
  link: string;
  image: string;
  cover: string;
}

export interface CollectionMetadata {
  title: string;
  description: string;
  media: string;
  mediaType: string;
  model: string;
  prompt: string;
  workflow: string;
}

export interface DropMetadata {
  title: string;
  description: string;
  image: string;
}

export interface Collection {
  id: string;
  collectionId: string;
  collectionContract: string;
  dropId: string;
  edition: string;
  price: string;
  uri: string;
  modelId: string;
  modelProfile: Designer;
  metadata: CollectionMetadata;
  designers: Designer[];
  tokenIds: string[];
  drop: Drop;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}
