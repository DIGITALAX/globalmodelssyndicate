export const LOCALES: string[] = ["en", "es", "pt"];
export const INFURA_GATEWAY: string = "https://thedial.infura-ipfs.io";
export const INFURA_GATEWAY_INTERNAL: string =
  "https://globaldesignernetwork.com/api/infura/";

export const NETWORKS = {
  LENS_TESTNET: {
    chainId: 37111,
    name: "Lens Network Testnet",
    rpcUrl: "https://rpc.testnet.lens.dev",
    blockExplorer: "https://block-explorer.testnet.lens.dev",
  },
  LENS_MAINNET: {
    chainId: 232,
    name: "Lens Network",
    rpcUrl: "https://rpc.lens.xyz",
    blockExplorer: "https://explorer.lens.xyz",
  },
} as const;

export type NetworkConfig = (typeof NETWORKS)[keyof typeof NETWORKS];

export const DEFAULT_NETWORK =
  process.env.NODE_ENV === "production"
    ? NETWORKS.LENS_MAINNET
    : NETWORKS.LENS_TESTNET;

export const getCurrentNetwork = (): NetworkConfig => {
  // const isMainnet = process.env.NEXT_PUBLIC_NETWORK === "mainnet";

  // isMainnet ?

  return NETWORKS.LENS_MAINNET;

  // : NETWORKS.LENS_TESTNET;
};
