"use client";
import { createContext, SetStateAction, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { chains } from "@lens-chain/sdk/viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorData, SuccessData } from "./components/Modals/types/modals.types";
import { getCurrentNetwork } from "./lib/constants";
import { Collection } from "./components/Model/types/model.types";

const queryClient = new QueryClient();
const currentNetwork = getCurrentNetwork();

export interface CartItem {
  collection: Collection;
  amount: number;
}

export const ModalContext = createContext<
  | {
      showSuccess: (message: string, txHash?: string) => void;
      showError: (message: string) => void;
      hideSuccess: () => void;
      hideError: () => void;
      successData: SuccessData | null;
      errorData: ErrorData | null;
      cartItems: CartItem[];
      addToCart: (collection: Collection, amount: number) => void;
      removeFromCart: (collectionId: string) => void;
      updateCartAmount: (collectionId: string, amount: number) => void;
      clearCart: () => void;
      cartOpen: boolean;
      setCartOpen: (e: SetStateAction<boolean>) => void;
    }
  | undefined
>(undefined);

export const config = createConfig(
  getDefaultConfig({
    appName: "Global Models Syndicate",
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    appUrl: "https://gms.globaldesignernetwork.com",
    appIcon: "https://gms.globaldesignernetwork.com/favicon.ico",
    chains: [chains.mainnet],
    connectors: [],
    transports: {
      [currentNetwork.chainId]: http(),
    },
    ssr: true,
  })
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  const showSuccess = (message: string, txHash?: string) => {
    setSuccessData({ message, txHash });
  };

  const showError = (message: string) => {
    setErrorData({ message });
  };

  const hideSuccess = () => {
    setSuccessData(null);
  };

  const hideError = () => {
    setErrorData(null);
  };

  const addToCart = (collection: Collection, amount: number) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.collection.collectionId === collection.collectionId
      );
      if (existing) {
        return prev.map((item) =>
          item.collection.collectionId === collection.collectionId
            ? { ...item, amount: item.amount + amount }
            : item
        );
      }
      return [...prev, { collection, amount }];
    });
  };

  const removeFromCart = (collectionId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.collection.collectionId !== collectionId)
    );
  };

  const updateCartAmount = (collectionId: string, amount: number) => {
    if (amount <= 0) {
      removeFromCart(collectionId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.collection.collectionId === collectionId
          ? { ...item, amount }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-font-family": '"Hidayatullah", cursive',
          }}
        >
          <ModalContext.Provider
            value={{
              showSuccess,
              showError,
              hideSuccess,
              hideError,
              successData,
              errorData,
              cartItems,
              addToCart,
              removeFromCart,
              updateCartAmount,
              clearCart,
              cartOpen,
              setCartOpen,
            }}
          >
            {children}
          </ModalContext.Provider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
