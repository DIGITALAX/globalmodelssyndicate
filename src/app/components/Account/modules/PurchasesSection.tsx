"use client";

import { FunctionComponent } from "react";
import { Purchase } from "../types/account.types";
import useBuyer from "../hooks/useBuyer";
import Image from "next/image";
import { getCurrentNetwork, INFURA_GATEWAY } from "@/app/lib/constants";
import { useAccount } from "wagmi";

const PurchasesSection: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const { address } = useAccount();
  const { purchases, buyerLoading } = useBuyer();
  const network = getCurrentNetwork();

  const getBlockExplorerUrl = (txHash: string) => {
    return `${network.blockExplorer}/tx/${txHash}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  if (!address) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-lg font-bold mb-4">{dict?.connectWallet}</div>
          <div className="text-gray-600">{dict?.connectWalletDesc}</div>
        </div>
      </div>
    );
  }

  if (buyerLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-lg">{dict?.loadingPurchases}</div>
        </div>
      </div>
    );
  }

  if (purchases?.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-lg font-bold mb-4">{dict?.noPurchases}</div>
          <div className="text-gray-600 mb-4">{dict?.startShopping}</div>
          <a
            href="/market"
            className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            {dict?.browseMarket}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {dict?.yourPurchases} ({purchases?.length})
        </h2>
        <p className="text-gray-600">{dict?.viewTransaction}</p>
      </div>

      <div className="grid gap-6">
        {purchases?.map((purchase: Purchase) => (
          <div
            key={purchase?.id}
            className="border-2 border-black p-6 bg-white"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-48 h-48">
                {purchase?.collection?.metadata?.mediaType === "mp4" ? (
                  <video
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover border border-black"
                  >
                    <source
                      src={`${INFURA_GATEWAY}/ipfs/${
                        purchase?.collection.metadata.media?.split(
                          "ipfs://"
                        )?.[1]
                      }`}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      purchase?.collection?.metadata?.media?.split(
                        "ipfs://"
                      )?.[1]
                    }`}
                    alt={purchase?.collection?.metadata?.title || "Collection"}
                    layout="fill"
                    draggable={false}
                    objectFit="cover"
                    className="border border-black"
                  />
                )}
              </div>

              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">
                    {purchase?.collection?.metadata?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {purchase?.collection?.metadata?.description}
                  </p>
                  <div className="text-sm text-gray-600">
                    {dict?.drop}: {purchase?.collection?.drop?.metadata?.title}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-bold">{dict?.amountPurchased}</div>
                    <div>
                      {purchase?.amount} {dict?.items}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{dict?.priceEach}</div>
                    <div>
                      {Number(purchase?.collection?.price) / 10 ** 18} MONA
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{dict?.totalPaid}</div>
                    <div>
                      {(
                        Number(
                          parseFloat(purchase?.collection?.price || "0") *
                            parseInt(purchase?.amount)
                        ) /
                        10 ** 18
                      ).toFixed(2)}{" "}
                      MONA
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{dict?.purchaseDate}</div>
                    <div>{formatDate(purchase?.blockTimestamp)}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row gap-4 text-sm">
                    <div className="flex-1">
                      <div className="font-bold">{dict?.tokenIdsOwned}</div>
                      <div className="flex flex-wrap gap-1">
                        {purchase?.tokenIds.map((tokenId) => (
                          <span
                            key={tokenId}
                            className="bg-gray-200 px-2 py-1 text-xs"
                          >
                            #{tokenId}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{dict?.transaction}</div>
                      <a
                        href={getBlockExplorerUrl(purchase?.transactionHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs break-all"
                      >
                        {purchase?.transactionHash.slice(0, 10)}...
                        {purchase?.transactionHash.slice(-8)}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <a
                    href={`/collection/${purchase?.collection?.collectionContract}/${purchase?.collection?.collectionId}`}
                    className="bg-pink-600 text-white px-4 py-2 text-sm hover:bg-pink-700 transition-colors"
                  >
                    {dict?.viewCollection}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasesSection;
