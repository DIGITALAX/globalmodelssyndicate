"use client";
import { FunctionComponent } from "react";
import Header from "../../Common/modules/Header";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Collection } from "../types/model.types";
import useModel from "../hooks/useModel";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const ModelEntry: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const { model: modelWallet } = useParams();
  const router = useRouter();
  const { modelLoading, model } = useModel(modelWallet as string);
  const modelCollections: Collection[] =
    model?.drops?.flatMap((drop) => drop.collections) || [];

  if (modelLoading) {
    return (
      <div className="relative flex flex-col">
        <Header dict={dict} />
        <div className="relative w-full h-screen bg-gray-50 flex items-center justify-center">
          <div className="ransom-note-typography">
            <span className="cut-out-letter bg-white text-black shadow-harsh text-2xl">
              {dict?.loadingCaps}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="relative flex flex-col">
        <Header dict={dict} />
        <div className="relative w-full h-screen bg-gray-50 flex items-center justify-center">
          <div className="ransom-note-typography flex flex-wrap text-center">
            <span className="cut-out-letter bg-red-600 text-white shadow-harsh text-4xl transform rotate-3">
              404
            </span>
            <span className="cut-out-letter bg-white text-black shadow-harsh text-2xl transform -rotate-2 ml-4">
              {dict?.modelNotFound}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col">
      <Header dict={dict} />

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
        <div className="w-full h-1 bg-gray-800 flex relative"></div>
        <div className="relative w-full h-fit lg:h-[30rem] flex flex-col lg:flex-row justify-between gap-10 bg-white">
          <div className="relative w-full lg:w-1/3 h-full flex flex-col justify-between p-8 gap-4">
            <div
              className="relative w-fit h-fit flex font-back glitch-text text-2xl"
              data-text={model?.metadata?.title}
            >
              {model?.metadata?.title}
            </div>
            <div className="relative w-full h-fit text-xs galaxy:text-sm sm:text-base lg:text-lg uppercase font-cyn flex-col flex gap-3">
              <div
                className="relative w-fit h-fit"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 20%, #c10007 20%, #c10007 100%)",
                }}
              >
                {dict?.web3Model}
              </div>
              <div
                className="relative w-full h-fit"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 20%, #c10007 20%, #c10007 100%)",
                }}
              >
                {model?.metadata?.description}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-bold">
                {dict?.totalSalesLabel}: {Number(model?.totalSales) / 10 ** 18}{" "}
                MONA
              </div>
              <div className="text-sm">
                {dict?.uniqueBuyersLabel}: {model?.uniqueBuyers ?? 0}
              </div>
              <div className="text-sm">
                {dict?.w3fReceived}: {Number(model?.w3fReceived) / 10 ** 18}
              </div>
              <div className="font-cyn text-xs bg-gray-100 px-2 py-1 break-all">
                {model?.wallet}
              </div>
            </div>
          </div>

          <div className="relative w-full lg:w-2/3 h-[25rem] lg:h-full flex">
            <div className="relative w-full h-full">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${
                  model?.metadata?.image?.split("ipfs://")?.[1]
                }`}
                alt={model?.metadata?.title}
                layout="fill"
                objectFit="cover"
                draggable={false}
                style={{
                  filter:
                    "saturate(3) hue-rotate(30deg) contrast(1.8) brightness(1.2) sepia(0.3)",
                }}
                className="border-4 border-black"
              />
              <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-2 transform rotate-12 shadow-harsh">
                {model?.drops?.length} DROPS
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-fit flex flex-col bg-white pb-4">
        <div className="relative w-full h-[20rem] sm:h-[25rem] md:h-[30rem] lg:h-[40rem] wheatpaste-texture underground-texture weathered-poster crinkled-wheatpaste wheatpaste-fold poster-wrinkles">
          <Image
            draggable={false}
            alt="Model Cover"
            objectFit="cover"
            src={`${INFURA_GATEWAY}/ipfs/${
              model?.metadata?.cover?.split("ipfs://")?.[1] ||
              model?.metadata?.image?.split("ipfs://")?.[1]
            }`}
            layout="fill"
            style={{
              filter: "sepia(1) hue-rotate(320deg) saturate(1.5) contrast(1.2)",
            }}
          />
        </div>
        <div className="relative w-full h-8 flex">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src="/videos/digitalax-globalmodelssyndicate-stitch.mp4" />
          </video>
        </div>
        <div className="relative w-full flex py-16 px-4 flex-col gap-2">
          <div className="relative font-back text-black text-[2rem] galaxy:text-[4rem] sm:text-[6rem] mid:text-[8rem] lg:text-[10rem] xl:text-[12rem] flex w-full h-fit items-end justify-end">
            DROPS
          </div>
          <div className="relative w-full h-fit flex flex-col gap-3 sm:flex-row flex-wrap justify-center sm:justify-between items-center">
            <div className="relative w-full sm:w-60 flex text-left font-ras text-black text-lg">
              {modelCollections.length} {dict?.collectionsCreated}
            </div>
            <div className="relative h-fit flex font-ric w-full sm:w-80 text-right text-sm">
              {dict?.exploringWeb3Fashion}
            </div>
          </div>
        </div>

        {modelCollections.length === 0 ? (
          <div className="relative w-full h-fit flex flex-col gap-2 px-6 py-12">
            <div className="font-ric w-full h-fit flex items-center justify-center text-2xl">
              {dict?.noCollectionsFound}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-fit flex flex-col gap-2 px-6">
            <div className="relative w-full h-fit grid items-center justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {modelCollections.map((collection: Collection, index: number) => (
                <div
                  key={collection.collectionId}
                  className="relative w-full h-40 sm:h-48 cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() =>
                    router.push(
                      `/collection/${collection.collectionContract}/${collection.collectionId}`
                    )
                  }
                >
                  {collection.metadata?.mediaType === "mp4" ? (
                    <video
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover border-2 border-black"
                    >
                      <source
                        src={`${INFURA_GATEWAY}/ipfs/${
                          collection.metadata.media?.split("ipfs://")?.[1]
                        }`}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <Image
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${
                        collection.metadata?.media?.split("ipfs://")?.[1]
                      }`}
                      alt={collection.metadata?.title}
                      layout="fill"
                      objectFit="cover"
                      className="border-2 border-black"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2">
                    <div className="text-xs font-bold truncate">
                      {collection.metadata?.title}
                    </div>
                    <div className="text-xs">
                      {Number(collection.price) / 10 ** 18} MONA
                    </div>
                    <div className="text-xs px-1 inline-block bg-gray-400 text-black">
                      {dict?.edition} {collection.edition ?? 0}
                    </div>
                  </div>
                  {collection.tokenIds?.length >=
                    parseInt(collection.edition) && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1">
                      {dict?.soldOut}
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black text-white text-xs px-1 py-0.5">
                    {collection.drop?.metadata?.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative w-full flex py-8 px-4 flex-col gap-2">
          <div className="relative w-full h-fit flex flex-col gap-3 sm:flex-row flex-wrap justify-center sm:justify-between items-center">
            <div className="relative w-full sm:w-60 flex text-left font-role text-black">
              {model?.drops.map((drop) => drop.metadata?.title).join(" • ")}
            </div>
            <div className="relative h-fit flex font-ric w-full sm:w-80 text-right">
              <div className="flex flex-wrap gap-2 justify-end">
                {model?.metadata?.link && (
                  <span className="bg-black text-white px-2 py-1 text-xs">
                    LINK
                  </span>
                )}
                <span className="bg-pink-600 text-white px-2 py-1 text-xs">
                  {model?.drops?.length} DROPS
                </span>
                <span className="bg-yellow-500 text-black px-2 py-1 text-xs">
                  W3F: {Number(model?.w3fReceived) / 10 ** 18}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelEntry;
