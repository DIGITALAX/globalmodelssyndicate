import GMSMarket from "./GMSMarket.json";
import GMSModels from "./GMSModels.json";

export const ABIS = {
  GMSMarket,
  GMSModels,
} as const;

export const getABI = (contractName: keyof typeof ABIS) => {
  return ABIS[contractName];
};
