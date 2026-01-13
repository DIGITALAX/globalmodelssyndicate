import {
  getCoreContractAddresses,
  getCurrentNetwork,
} from "@/app/lib/constants";
import { useEffect, useState } from "react";
import { usePublicClient, useAccount as useAccountWagmi } from "wagmi";
import { Drop, Model } from "../../Model/types/model.types";
import { ensureMetadata } from "@/app/lib/utils";
import { getModel } from "../../../../../graphql/gms/getModels";

const useModel = (dict?: any) => {
  const { address } = useAccountWagmi();
  const publicClient = usePublicClient();
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [model, setModel] = useState<Model | undefined>();
  const [verified, setVerified] = useState<boolean>(false);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);

  const verifyModel = async () => {
    if (!address) return;
    setModelLoading(true);
    try {
      const verified = await publicClient?.readContract({
        address: contracts.access,
        abi: [
          {
            type: "function",
            name: "isModel",
            inputs: [
              { name: "_address", type: "address", internalType: "address" },
            ],
            outputs: [{ name: "", type: "bool", internalType: "bool" }],
            stateMutability: "view",
          },
        ],
        functionName: "isModel",
        args: [address],
        account: address,
      });
      setVerified(true);
      if (verified) {
        const data = await getModel(address);
        let des = await ensureMetadata(data?.data?.models?.[0]);

        if (des) {
          const processedCollections = await Promise.all(
            (des?.collections || []).map(async (col: any) => {
              return await ensureMetadata(col);
            })
          );

          const dropsWithCollections = await Promise.all(
            (des?.drops || []).map(async (drop: Drop) => {
              const dropData = await ensureMetadata(drop);
              const dropCollections = processedCollections.filter(
                (col) => col?.drop?.dropId === drop?.dropId
              );
              return {
                ...dropData,
                collections: dropCollections,
              };
            })
          );

          const orphanCollections = processedCollections.filter(
            (col) =>
              !col?.drop ||
              col?.drop?.dropId === null ||
              col?.drop?.dropId === undefined
          );

          const finalDrops = [...dropsWithCollections];
          if (orphanCollections.length > 0) {
            finalDrops.push({
              dropId: "orphan",
              metadata: {
                title: dict?.orphanCollections,
                description: dict?.orphanCollectionsDescription,
                image: "",
              },
              collections: orphanCollections,
              uri: "",
              blockNumber: "",
              blockTimestamp: "",
              transactionHash: "",
            });
          }

          setModel({
            ...des,
            drops: finalDrops,
          });
        }
      } else {
        setVerified(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setModelLoading(false);
  };

  useEffect(() => {
    if (address && !model) {
      verifyModel();
    }
  }, [address]);

  return {
    modelLoading,
    model,
    verified,
  };
};

export default useModel;
