"use client";

import { FunctionComponent, useContext } from "react";
import Header from "../../Common/modules/Header";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import useCollection from "../hooks/useCollection";
import usePurchase from "../hooks/usePurchase";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const CollectionEntry: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const { collectionContract, collectionId } = useParams();
  const context = useContext(ModalContext);
  const { collectionLoading, collection } = useCollection(
    collectionContract as string,
    collectionId as string
  );
  const {
    purchaseLoading,
    approveLoading,
    purchaseAmount,
    setPurchaseAmount,
    approved,
    handlePurchaseFlow,
    totalPrice,
    isAvailable,
  } = usePurchase(dict, collection);
  const router = useRouter();

  if (collectionLoading) {
    return (
      <div className="relative flex flex-col">
        <Header dict={dict} />
        <div className="relative w-full h-screen bg-black flex items-center justify-center">
          <div className="ransom-note-typography">
            <span className="cut-out-letter bg-white text-black shadow-harsh text-2xl">
              {dict?.loadingCaps}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="relative flex flex-col">
        <Header dict={dict} />
        <div className="relative w-full h-screen bg-black flex items-center justify-center">
          <div className="ransom-note-typography flex flex-wrap text-center">
            <span className="cut-out-letter bg-red-600 text-white shadow-harsh text-4xl transform rotate-3">
              404
            </span>
            <span className="cut-out-letter bg-white text-black shadow-harsh text-2xl transform -rotate-2 ml-4">
              {dict?.collectionNotFound}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col">
      <Header dict={dict} />
      <div className="relative wheatpaste-texture w-full flex overflow-hidden bg-black">
        <div className="relative w-full h-full flex">
          {collection?.metadata?.mediaType === "mp4" ? (
            <video
              autoPlay
              loop
              muted
              className="w-full h-full object-contain"
              style={{ maxHeight: "60vh" }}
            >
              <source
                src={`${INFURA_GATEWAY}/ipfs/${
                  collection?.metadata.media?.split("ipfs://")?.[1]
                }`}
                type="video/mp4"
              />
            </video>
          ) : (
            <Image
              layout="responsive"
              width={960}
              height={416}
              objectFit="contain"
              draggable={false}
              src={`${INFURA_GATEWAY}/ipfs/${
                collection?.metadata?.media?.split("ipfs://")?.[1]
              }`}
              alt={collection?.metadata?.title}
              style={{
                filter: "contrast(1.3) brightness(1.1)",
              }}
            />
          )}
        </div>
      </div>
      <div className="w-full h-fit flex bg-white flex flex-col">
        <div className="relative w-full h-8 flex">
          <video
            autoPlay
            draggable={false}
            loop
            muted
            className="w-full h-full object-cover"
          >
            <source src="/videos/digitalax-globalmodelssyndicate-stitch.mp4" />
          </video>
        </div>
        <div className="w-full h-6 bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 flex relative"></div>

        <div className="relative w-full h-fit flex flex-col lg:flex-row justify-between gap-10 bg-white">
          <div className="relative w-full lg:w-2/3 h-full flex flex-col justify-between p-8 gap-4">
            <div
              className="relative w-fit h-fit flex font-role glitch-text text-3xl"
              data-text={collection?.metadata?.title}
            >
              {collection?.metadata?.title}
            </div>

            <div className="relative w-full h-fit text-xs galaxy:text-sm sm:text-base lg:text-lg uppercase font-ric flex-col flex gap-3">
              <div
                className="relative w-fit h-fit"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 20%, #c10007 20%, #c10007 100%)",
                }}
              >
                {collection?.drop?.metadata?.title}
              </div>
              <div
                className="relative w-full h-fit"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 20%, #c10007 20%, #c10007 100%)",
                }}
              >
                {collection?.metadata?.description}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                <span className="bg-black text-white px-3 py-1 text-sm">
                  {dict?.lensNetwork}
                </span>
                <span className="bg-yellow-400 text-black px-3 py-1 text-sm">
                  {dict?.editionLabel} {collection?.edition}
                </span>
                <span className="bg-white border-2 border-black text-black px-3 py-1 text-sm">
                  {collection?.tokenIds?.length || 0} / {collection?.edition}{" "}
                  {dict?.minted}
                </span>
              </div>

              <div className="flex items-center gap-3  flex-wrap">
                <span className="text-sm font-bold">
                  {dict?.modelLabel}:
                </span>
                <button
                  onClick={() =>
                    router.push(
                      `/designer/${collection?.modelProfile?.wallet}`
                    )
                  }
                  className="bg-pink-600 text-white px-3 py-1 text-sm hover:scale-105 transition-transform cursor-pointer"
                >
                  {collection?.modelProfile?.metadata?.title ||
                    collection?.modelProfile?.wallet?.slice(0, 8) + "..."}
                </button>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-bold">{dict?.dropLabel}:</span>
                <span className="bg-yellow-400 text-black px-3 py-1 text-sm">
                  {collection?.drop?.metadata?.title}
                </span>
              </div>

              {(collection?.metadata?.model ||
                collection?.metadata?.prompt ||
                collection?.metadata?.workflow) && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-bold mb-3">
                    {dict?.aiCreationDetails}
                  </h4>
                  <div className="space-y-2">
                    {collection?.metadata?.model && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase text-gray-600">
                          {dict?.model}:
                        </span>
                        <span className="text-sm bg-gray-100 px-2 py-1 border">
                          {collection?.metadata.model}
                        </span>
                      </div>
                    )}
                    {collection?.metadata?.prompt && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase text-gray-600">
                          {dict?.prompt}:
                        </span>
                        <span className="text-sm bg-gray-100 px-2 py-1 border">
                          {collection?.metadata.prompt}
                        </span>
                      </div>
                    )}
                    {collection?.metadata?.workflow && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase text-gray-600">
                          {dict?.workflow}:
                        </span>
                        <span className="text-sm bg-gray-100 px-2 py-1 border">
                          {collection?.metadata.workflow}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative w-full lg:w-1/3 min-h-fit h-[25rem] lg:h-full flex bg-black text-white p-6">
            <div className="relative w-full h-full flex flex-col justify-between">
              <div>
                <div className="relative font-kare text-white text-[2rem] sm:text-[3rem] lg:text-[4rem] flex w-full h-fit items-end justify-end mb-4">
                  MONA
                </div>

                <div className="mb-6">
                  <div className="text-2xl font-bold mb-2">
                    {Number(collection?.price) / 10 ** 18} MONA
                  </div>
                  <div className="text-sm opacity-70">{dict?.unitPrice}</div>
                </div>

                {isAvailable ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        {dict?.quantity}:
                      </label>
                      <div className="flex items-center gap-3 flex-wrap">
                        <button
                          onClick={() => {
                            if (purchaseAmount - 1 == 0) return;
                            setPurchaseAmount(Math.max(1, purchaseAmount - 1));
                          }}
                          disabled={purchaseAmount == 1}
                          className="bg-white text-black w-8 h-8 flex items-center justify-center font-bold hover:scale-110 transition-transform"
                        >
                          -
                        </button>
                        <span className="text-xl font-bold w-12 text-center">
                          {purchaseAmount}
                        </span>
                        <button
                          onClick={() => {
                            if (
                              purchaseAmount + 1 >
                              Number(collection?.edition) -
                                Number(collection?.tokenIds?.length)
                            )
                              return;

                            setPurchaseAmount(purchaseAmount + 1);
                          }}
                          disabled={
                            purchaseAmount + 1 > Number(collection?.edition)
                          }
                          className="bg-white text-black w-8 h-8 flex items-center justify-center font-bold hover:scale-110 transition-transform"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg">{dict?.total}:</span>
                        <span className="text-2xl font-bold">
                          {(Number(totalPrice) / 10 ** 18).toFixed(2)} MONA
                        </span>
                      </div>
                      <div className="text-xs opacity-70 mb-4">
                        {approved
                          ? dict?.approvalComplete
                          : dict?.requiresMonaApproval}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-600 text-white p-4 text-center">
                    <div className="text-xl font-bold">{dict?.soldOut}</div>
                    <div className="text-sm">
                      {dict?.thisCollectionIsSoldOut}
                    </div>
                  </div>
                )}
              </div>

              {isAvailable && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handlePurchaseFlow}
                    disabled={purchaseLoading || approveLoading}
                    className={`w-full py-4 text-lg font-bold transition-all duration-300 ${
                      purchaseLoading || approveLoading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-yellow-400 text-black hover:scale-105 shadow-harsh"
                    }`}
                  >
                    {approveLoading
                      ? dict?.approvingMona
                      : purchaseLoading
                      ? dict?.buying
                      : !approved
                      ? `${dict?.approveAndBuy} ${(
                          Number(totalPrice) /
                          10 ** 18
                        ).toFixed(2)} MONA`
                      : `${dict?.buyNow} ${(
                          Number(totalPrice) /
                          10 ** 18
                        ).toFixed(2)} MONA`}
                  </button>
                  <button
                    onClick={() => {
                      if (collection) {
                        context?.addToCart(collection, purchaseAmount);
                        context?.setCartOpen(true);
                      }
                    }}
                    disabled={
                      purchaseAmount + 1 >
                      Number(collection?.edition) -
                        Number(collection?.tokenIds.length)
                    }
                    className="w-full py-3 text-lg font-bold bg-black text-white hover:bg-gray-800 transition-all duration-300"
                  >
                    {dict?.addToCart}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-col bg-white pb-4">
        <div className="relative w-full flex py-16 px-4 flex-col gap-2">
          <div className="relative w-full h-fit flex flex-col gap-3 sm:flex-row flex-wrap justify-center sm:justify-between items-center">
            <div className="relative w-full sm:w-60 flex text-left font-ras text-black">
              <div className="text-sm">
                <div>
                  <strong>{dict?.collectionIdLabel}:</strong>{" "}
                  {collection?.collectionId}
                </div>
                <div>
                  <strong>{dict?.dropIdLabel}:</strong> {collection?.dropId}
                </div>
                <div>
                  <strong>{dict?.editionSize}:</strong> {collection?.edition}
                </div>
                <div>
                  <strong>{dict?.modelLabel}:</strong>{" "}
                  {collection?.modelProfile?.wallet?.slice(0, 10)}
                  ...
                </div>
              </div>
            </div>
            <div className="relative h-fit flex font-hid w-full sm:w-80 text-right">
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() =>
                    router.push(
                      `/designer/${collection?.modelProfile?.wallet}`
                    )
                  }
                  className="bg-black text-white px-3 py-1 text-xs hover:scale-110 transition-transform"
                >
                  {dict?.viewDesigner}
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `${INFURA_GATEWAY}/ipfs/${
                        collection?.metadata?.media?.split("ipfs://")?.[1]
                      }`
                    )
                  }
                  className="bg-pink-600 text-white px-3 py-1 text-xs hover:scale-110 transition-transform"
                >
                  {dict?.viewMedia}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CollectionEntry;
