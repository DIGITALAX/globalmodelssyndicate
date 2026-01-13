import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import { W3FStats, W3FTransaction } from "../types/common.types";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";

const useW3F = () => {
  const [loading, setLoading] = useState(true);
  const [w3fStats, setW3fStats] = useState<W3FStats>({ totalSupply: "0" });
  const [recentTransactions, setRecentTransactions] = useState<
    W3FTransaction[]
  >([]);
  const [activeTab, setActiveTab] = useState<"stats" | "activity">("stats");
  const [glitchEffect, setGlitchEffect] = useState(false);

  const publicClient = usePublicClient();
  const network = getCurrentNetwork();
  const chainId = publicClient?.chain?.id ?? network.chainId;
  const contracts = getCoreContractAddresses(chainId);
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const fetchW3FStats = async (): Promise<W3FStats> => {
    if (!publicClient || !contracts.w3f) {
      return { totalSupply: "0" };
    }

    try {
      const totalSupply = await publicClient.readContract({
        address: contracts.w3f,
        abi: [
          {
            type: "function",
            name: "totalSupply",
            inputs: [],
            outputs: [{ name: "", type: "uint256" }],
            stateMutability: "view",
          },
        ],
        functionName: "totalSupply",
      });

      return { totalSupply: totalSupply.toString() };
    } catch (error) {
      console.error("Error fetching W3F stats:", error);
      return { totalSupply: "0" };
    }
  };

  const fetchRecentTransactions = async (): Promise<W3FTransaction[]> => {
    if (!publicClient || !contracts.w3f) return [];

    try {
      const latestBlock = await publicClient.getBlockNumber();
      const lookbacks = [BigInt(5000), BigInt(50000), BigInt(250000)];

      const fetchLogsInRange = async (fromBlock: bigint) => {
        const [transferLogs, mintedLogs] = await Promise.all([
          publicClient.getLogs({
            address: contracts.w3f,
            event: {
              type: "event",
              name: "Transfer",
              inputs: [
                { indexed: true, name: "from", type: "address" },
                { indexed: true, name: "to", type: "address" },
                { indexed: false, name: "value", type: "uint256" },
              ],
            },
            fromBlock,
            toBlock: latestBlock,
          }),
          publicClient.getLogs({
            address: contracts.w3f,
            event: {
              type: "event",
              name: "W3FMinted",
              inputs: [
                { indexed: false, name: "to", type: "address" },
                { indexed: false, name: "amount", type: "uint256" },
              ],
            },
            fromBlock,
            toBlock: latestBlock,
          }),
        ]);

        return { transferLogs, mintedLogs };
      };

      let transferLogs: any[] = [];
      let mintedLogs: any[] = [];

      for (const lookback of lookbacks) {
        const fromBlock =
          latestBlock > lookback ? latestBlock - lookback : BigInt(0);
        const result = await fetchLogsInRange(fromBlock);
        transferLogs = result.transferLogs;
        mintedLogs = result.mintedLogs;
        if (transferLogs.length > 0 || mintedLogs.length > 0) {
          break;
        }
      }

      if (transferLogs.length === 0 && mintedLogs.length === 0) {
        const result = await fetchLogsInRange(BigInt(0));
        transferLogs = result.transferLogs;
        mintedLogs = result.mintedLogs;
      }

      const mintedTransactions = await Promise.all(
        mintedLogs.map(async (log) => {
          const args = log.args as any;
          let from = zeroAddress;

          if (log.transactionHash) {
            try {
              const tx = await publicClient.getTransaction({
                hash: log.transactionHash,
              });
              from = tx.from || zeroAddress;
            } catch (error) {
              console.error("Error fetching mint transaction:", error);
            }
          }

          return {
            hash: log.transactionHash || "",
            from,
            to: args.to,
            amount: args.amount.toString(),
            type: "MINT" as const,
            blockNumber: log.blockNumber?.toString() || "0",
            logIndex: Number(log.logIndex ?? 0),
          };
        })
      );

      const combined = [
        ...transferLogs.map((log) => {
          const args = log.args as any;
          const from = args.from;
          const to = args.to;
          const amount = args.value.toString();

          let type: W3FTransaction["type"] = "TRANSFER";

          if (from === zeroAddress) {
            type = "MINT";
          } else if (to === zeroAddress) {
            type = "BURN";
          }

          return {
            hash: log.transactionHash || "",
            from,
            to,
            amount,
            type,
            blockNumber: log.blockNumber?.toString() || "0",
            logIndex: Number(log.logIndex ?? 0),
          };
        }),
        ...mintedTransactions,
      ];

      const transactions: W3FTransaction[] = combined
        .sort((a, b) => {
          const blockDelta = Number(b.blockNumber) - Number(a.blockNumber);
          if (blockDelta !== 0) return blockDelta;
          return b.logIndex - a.logIndex;
        })
        .slice(0, 7)
        .map(({ logIndex, ...tx }) => tx);

      return transactions;
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchW3FData = async () => {
      setLoading(true);
      try {
        const [stats, transactions] = await Promise.all([
          fetchW3FStats(),
          fetchRecentTransactions(),
        ]);

        setW3fStats(stats);
        setRecentTransactions(transactions);
      } catch (error) {
        console.error("Error fetching W3F data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchW3FData();
  }, [publicClient, contracts]);

  return {
    w3fStats,
    recentTransactions,
    loading,
    activeTab,
    setActiveTab,
    glitchEffect,
    setGlitchEffect,
  };
};

export default useW3F;
