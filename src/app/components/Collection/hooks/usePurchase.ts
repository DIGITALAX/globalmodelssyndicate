"use client";

import { useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { CartItem, ModalContext } from "@/app/providers";
import { Collection } from "../../Model/types/model.types";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { ABIS } from "@/app/abis";
import useLensChain from "../../Common/hooks/useLensChain";

const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
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
] as const;

const toWei = (value: string | undefined | null): bigint => {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) {
    throw new Error("Invalid price");
  }
  return BigInt(text);
};

const toCount = (value: number): bigint => {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("Invalid amount");
  }
  return BigInt(value);
};

const usePurchase = (dict: any, collection?: Collection | undefined) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const context = useContext(ModalContext);
  const { ensureLensWallet } = useLensChain();
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
        abi: ERC20_ABI,
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

  const readAllowance = async (): Promise<bigint> => {
    if (!address || !publicClient) return BigInt(0);
    return await publicClient.readContract({
      address: contracts.mona,
      abi: ERC20_ABI,
      functionName: "allowance",
      args: [address, contracts.market],
    });
  };

  const handlePurchase = async () => {
    if (!address || !publicClient || !collection) return;
    setPurchaseLoading(true);
    try {
      if (collection?.tokenIds?.length == Number(collection?.edition)) {
        context?.showError(dict?.soldOut);
        setPurchaseLoading(false);
        return;
      }

      const count = toCount(purchaseAmount);
      const requiredAmount = toWei(collection.price) * count;

      const hasBalance = await checkBalance(requiredAmount);
      if (!hasBalance) {
        setPurchaseLoading(false);
        return;
      }

      const allowance = await readAllowance();
      if (allowance < requiredAmount) {
        setApproved(false);
        context?.showError(dict?.requiresMonaApproval);
        setPurchaseLoading(false);
        return;
      }

      const wallet = await ensureLensWallet();
      const { request } = await publicClient.simulateContract({
        address: contracts.market,
        abi: ABIS.GMSMarket,
        functionName: "buy",
        args: [BigInt(collection.collectionId), count, ""],
        account: address,
      });
      const hash = await wallet.writeContract(request);
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

  const handleApprove = async (amount: bigint): Promise<boolean> => {
    if (!address || !publicClient || amount <= BigInt(0)) return false;
    setApproveLoading(true);
    let success = false;
    try {
      const wallet = await ensureLensWallet();
      const { request } = await publicClient.simulateContract({
        address: contracts.mona,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [contracts.market, amount],
        account: address,
      });
      const hash = await wallet.writeContract(request);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") {
        throw new Error("Approval reverted");
      }
      const allowance = await readAllowance();
      if (allowance < amount) {
        throw new Error("Allowance below required amount");
      }
      success = true;
      setApproved(true);
      context?.showSuccess(dict?.approveSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.approveError);
    }
    setApproveLoading(false);
    return success;
  };

  const checkApproved = async () => {
    if (!address || !publicClient || !collection) return;
    try {
      const allowance = await readAllowance();
      const requiredAmount = toWei(collection.price) * toCount(purchaseAmount);
      setApproved(allowance >= requiredAmount);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (address && publicClient && collection) {
      checkApproved();
    }
  }, [address, publicClient, collection, purchaseAmount]);

  const handleApproveFlow = async () => {
    if (!collection) return;
    try {
      const totalAmount = toWei(collection.price) * toCount(purchaseAmount);
      await handleApprove(totalAmount);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.approveError);
    }
  };

  const handlePurchaseFlow = async () => {
    if (!approved) {
      await handleApproveFlow();
    } else {
      await handlePurchase();
    }
  };

  const handleBuyBatch = async (cartItems: CartItem[]) => {
    if (!address || !publicClient || cartItems.length === 0) return;
    setBatchLoading(true);
    try {
      const collectionIds = cartItems.map((item) =>
        BigInt(item.collection.collectionId)
      );
      const amounts = cartItems.map((item) => toCount(item.amount));
      const fulfillments = Array.from({ length: amounts.length }, () => "");

      const totalAmount = cartItems.reduce(
        (sum, item, index) =>
          sum + toWei(item.collection.price) * amounts[index],
        BigInt(0)
      );

      const hasBalance = await checkBalance(totalAmount);
      if (!hasBalance) {
        setBatchLoading(false);
        return;
      }

      const allowance = await readAllowance();
      if (allowance < totalAmount) {
        const approvedNow = await handleApprove(totalAmount);
        if (!approvedNow) {
          setBatchLoading(false);
          return;
        }
      }

      const wallet = await ensureLensWallet();
      const { request } = await publicClient.simulateContract({
        address: contracts.market,
        abi: ABIS.GMSMarket,
        functionName: "buyBatch",
        args: [collectionIds, amounts, fulfillments],
        account: address,
      });
      const hash = await wallet.writeContract(request);
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
