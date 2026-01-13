import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Purchase } from "../types/account.types";
import { getBuyer } from "../../../../../graphql/gms/getBuyers";
import { ensureMetadata } from "@/app/lib/utils";

const useBuyer = () => {
  const { address } = useAccount();
  const [buyerLoading, setBuyerLoading] = useState<boolean>(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const handleBuyer = async () => {
    if (!address) return;
    setBuyerLoading(true);
    try {
      const data = await getBuyer(address);
      let purchases = await Promise.all(
        data?.data?.purchases?.map(async (data: any) => {
          return {
            ...data,
            collection: await ensureMetadata(data?.collection),
          };
        })
      );
      setPurchases(purchases);
    } catch (err: any) {
      console.error(err.message);
    }
    setBuyerLoading(false);
  };

  useEffect(() => {
    if (address && purchases?.length < 1) {
      handleBuyer();
    }
  }, [address]);

  return {
    buyerLoading,
    purchases,
  };
};

export default useBuyer;
