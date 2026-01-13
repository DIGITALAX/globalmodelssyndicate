import {
  CoreContractAddresses,
  Runway,
} from "../components/Common/types/common.types";

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

export const CORE_CONTRACT_ADDRESSES: Record<number, CoreContractAddresses> = {
  [NETWORKS.LENS_TESTNET.chainId]: {
    market: "0x4248766A71C8d44F69F7faFb566A792541699d37",
    designers: "0x355dC5265bd765215905Cd3838E8C5F5cbcc0964",
    mona: "0x28547B5b6B405A1444A17694AC84aa2d6A03b3Bd",
    access: "0x159B3b107Ae93f90EC41cf03CCF9636ca3e4356F",
    w3f: "0xD1F5BeC17de63673A08B71C525Fc163D4Ea7b95f",
    nft: "0x692A6c986D8ca535Feebeb4efE5A389427a73De6",
    models: "0x526b330F807b2B94a39463C9aAA19d1eC55816BD",
  },
  [NETWORKS.LENS_MAINNET.chainId]: {
    market: "0x4248766A71C8d44F69F7faFb566A792541699d37",
    designers: "0x355dC5265bd765215905Cd3838E8C5F5cbcc0964",
    mona: "0x28547B5b6B405A1444A17694AC84aa2d6A03b3Bd",
    access: "0x159B3b107Ae93f90EC41cf03CCF9636ca3e4356F",
    w3f: "0xD1F5BeC17de63673A08B71C525Fc163D4Ea7b95f",
    nft: "0x692A6c986D8ca535Feebeb4efE5A389427a73De6",
    models: "0x526b330F807b2B94a39463C9aAA19d1eC55816BD",
  },
};

export const getCoreContractAddresses = (
  chainId: number
): CoreContractAddresses => {
  const addresses = CORE_CONTRACT_ADDRESSES[chainId];
  if (!addresses) {
    throw new Error(
      `Core contract addresses not found for chain ID: ${chainId}`
    );
  }
  return addresses;
};

export const COMPLEMENTS: Runway[] = [
  {
    src: "/videos/digitalax-globalmodelssyndicate-makeup.mp4",
    poster: "/images/digitalax-globalmodelssyndicate-makeup.png",
  },

  {
    src: "/videos/digitalax-globalmodelssyndicate-hairstyle.mp4",
    poster: "/images/digitalax-globalmodelssyndicate-hairstyle.png",
  },

  {
    src: "/videos/digitalax-globalmodelssyndicate-nails.mp4",
    poster: "/images/digitalax-globalmodelssyndicate-nails.png",
  },
];

export const GMS: Runway[] = [
  {
    src: "/videos/digitalax-globalmodelssyndicate-mirror-hair.mp4",
    poster: "/images/digitalax-globalmodelssyndicate-mirror-hair.png",
  },
  {
    src: "/videos/digitalax-globalmodelssyndicate-camera.mp4",
    poster: "/images/digitalax-globalmodelssyndicate-camera.png",
  },
  {
    src: "/videos/digitalax-globalmodelssyndicate-camera-twist.mp4",
    poster: "/images/digitalax-globalmodelssyndicate-camera-twist.png",
  },
];
