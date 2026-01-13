"use client";

import { useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { CartItem, ModalContext } from "@/app/providers";
import { Collection } from "../../Model/types/model.types";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/app/abis";

const usePurchase = (dict: any, collection?: Collection | undefined) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const context = useContext(ModalContext);
  const { data: walletClient } = useWalletClient();
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [batchLoading, setBatchLoading] = useState<boolean>(false);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(1);
  const [approved, setApproved] = useState<boolean>(false);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const checkBalance = async (requiredAmount: bigint): Promise<boolean> => {
    if (!address || !publicClient) return false;
    try {
      const balance = await publicClient.readContract({
        address: contracts.mona,
        abi: [
          {
            type: "function",
            name: "balanceOf",
            inputs: [
              { name: "account", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
          },
        ],
        functionName: "balanceOf",
        args: [address],
      });

      if (balance < requiredAmount) {
        context?.showError(dict?.insufficientMona);
        return false;
      }
      return true;
    } catch (err: any) {
      console.error(err.message);
      return false;
    }
  };

  const handlePurchase = async () => {
    if (!walletClient || !address || !publicClient || !collection) return;
    setPurchaseLoading(true);
    try {
      if (collection?.tokenIds?.length == Number(collection?.edition)) {
        context?.showError(dict?.soldOut);
        setPurchaseLoading(false);
        return;
      }

      const requiredAmount = parseFloat(collection.price) * purchaseAmount;

      const hasBalance = await checkBalance(BigInt(requiredAmount));
      if (!hasBalance) {
        setPurchaseLoading(false);
        return;
      }

      const hash = await walletClient.writeContract({
        address: contracts.market,
        abi: ABIS.GMSMarket,
        functionName: "buy",
        args: [BigInt(collection.collectionId), BigInt(purchaseAmount), ""],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      setPurchaseAmount(1);
      await checkApproved();
      context?.showSuccess(dict?.purchaseSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.purchaseError);
    }
    setPurchaseLoading(false);
  };

  const handleApprove = async (amount: bigint) => {
    if (!walletClient || !address || !publicClient) return;
    setApproveLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.mona,
        abi: [
          {
            type: "function",
            name: "approve",
            inputs: [
              { name: "spender", type: "address", internalType: "address" },
              { name: "value", type: "uint256", internalType: "uint256" },
            ],
            outputs: [{ name: "", type: "bool", internalType: "bool" }],
            stateMutability: "nonpayable",
          },
        ],
        functionName: "approve",
        args: [contracts.market, amount],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      setApproved(true);
      context?.showSuccess(dict?.approveSuccess, hash);
    } catch (err: any) {
      setApproveLoading(false);
      console.error(err.message);
      context?.showError(dict?.approveError);
    }
    setApproveLoading(false);
  };

  const checkApproved = async () => {
    if (!address || !publicClient || !collection) return;
    try {
      const data = await publicClient?.readContract({
        address: contracts.mona,
        abi: [
          {
            type: "function",
            name: "allowance",
            inputs: [
              { name: "owner", type: "address", internalType: "address" },
              { name: "spender", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
            stateMutability: "view",
          },
        ],
        functionName: "allowance",
        args: [address, contracts.market],
        account: address,
      });
      if (Number(data) >= Number(collection.price) * purchaseAmount) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!approved && address && publicClient && collection) {
      checkApproved();
    }
  }, [address, publicClient, collection, purchaseAmount]);

  const handleApproveFlow = async () => {
    const totalAmount = parseFloat(collection?.price || "0") * purchaseAmount;
    await handleApprove(BigInt(totalAmount));
  };

  const handlePurchaseFlow = async () => {
    if (!approved) {
      await handleApproveFlow();
    } else {
      await handlePurchase();
    }
  };

  const handleBuyBatch = async (cartItems: CartItem[]) => {
    if (!walletClient || !address || !publicClient || cartItems.length === 0)
      return;
    setBatchLoading(true);
    try {
      const collectionIds = cartItems.map((item) =>
        Number(item.collection.collectionId)
      );
      const amounts = cartItems.map((item) => item.amount);
      const fulfillments = Array.from({ length: amounts.length }, () => "");

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.collection.price) * item.amount,
        0
      );

      const hasBalance = await checkBalance(BigInt(totalAmount));
      if (!hasBalance) {
        setBatchLoading(false);
        return;
      }

      await handleApprove(BigInt(totalAmount));

      const hash = await walletClient.writeContract({
        address: contracts.market,
        abi: ABIS.GMSMarket,
        functionName: "buyBatch",
        args: [collectionIds, amounts, fulfillments],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.batchPurchaseSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.batchPurchaseError);
    }
    setBatchLoading(false);
  };

  const totalPrice = parseFloat(collection?.price || "0") * purchaseAmount;
  const isAvailable =
    (collection?.tokenIds?.length || 0) < parseInt(collection?.edition || "0");

  return {
    purchaseLoading,
    handlePurchase,
    setPurchaseAmount,
    purchaseAmount,
    handleApprove,
    approved,
    approveLoading,
    handleApproveFlow,
    handlePurchaseFlow,
    totalPrice,
    isAvailable,
    handleBuyBatch,
    batchLoading,
  };
};

export default usePurchase;
