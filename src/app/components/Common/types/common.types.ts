export interface SuccessData {
  message: string;
  txHash?: string;
}

export interface ErrorData {
  message: string;
}

export type HeaderProps = {
  dict: any;
};

export interface Runway {
  src: string;
  poster: string;
}

export interface CoreContractAddresses {
  mona: `0x${string}`;
  market: `0x${string}`;
  designers: `0x${string}`;
  access: `0x${string}`;
  w3f: `0x${string}`;
  nft: `0x${string}`;
  models: `0x${string}`;
}

export interface W3FStats {
  totalSupply: string;
}

export interface W3FTransaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  type: "MINT" | "TRANSFER" | "BURN";
  blockNumber: string;
}
