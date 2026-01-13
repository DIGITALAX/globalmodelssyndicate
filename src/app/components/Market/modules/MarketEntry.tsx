"use client";

import { useRouter } from "next/navigation";
import {
  FunctionComponent,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import Header from "../../Common/modules/Header";
import Image from "next/image";
import useMarket from "../hooks/useMarket";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { Collection } from "../../Model/types/model.types";

const MarketEntry: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const {
    collectionsLoading,
    collections,
    loadMore,
    selectedDrop,
    setSelectedDrop,
    filteredCollections,
    drops,
    featuredDrop,
  } = useMarket();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!context) {
    return null;
  }

  const { addToCart } = context;

  return (
    <div className="relative flex flex-col">
      <Header dict={dict} />
      {drops?.[0] && (
        <div className="h-fit flex w-full bg-gray-50 relative">
          <div className="flex flex-col mid:flex-row h-fit mid:h-[50rem] relative w-full">
            <div className="mid:border-r-4 border-gray-800 p-4 flex flex-col relative items-start justify-start h-fit mid:h-full w-full mid:w-1/3 bg-white">
              <div
                className="relative w-full h-fit flex text-3xl mb-4 font-cyn glitch-text"
                data-text={dict?.amplified}
              >
                {dict?.amplified}
              </div>
              <div className="relative w-full h-64 mb-4">
                {featuredDrop?.metadata?.image &&
                  (featuredDrop?.metadata?.image?.includes(".mp4") ? (
                    <video
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover border-2 border-gray-800"
                    >
                      <source
                        src={`${INFURA_GATEWAY}/ipfs/${
                          featuredDrop.metadata.image?.split("ipfs://")?.[1]
                        }`}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        featuredDrop.metadata.image?.split("ipfs://")?.[1]
                      }`}
                      alt={featuredDrop.metadata.title}
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                      className="border-2 border-gray-800"
                    />
                  ))}
              </div>
              <div className="relative w-full h-fit flex flex-col gap-3">
                <h2 className="text-xl font-bold">
                  {featuredDrop?.metadata?.title}
                </h2>
                <p className="text-sm">{featuredDrop?.metadata?.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-800 text-white px-2 py-1 text-xs">
                    {featuredDrop?.collections?.length || 0}{" "}
                    {dict?.collectionsAvailable}
                  </span>
                  <span className="bg-yellow-500 text-black px-2 py-1 text-xs">
                    {dict?.modelCollection}
                  </span>
                </div>
                <div
                  className="relative w-full h-fit flex flex-row gap-3 items-center cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() =>
                    router.push(
                      `/model/${featuredDrop?.modelProfile?.wallet}`
                    )
                  }
                >
                  {featuredDrop?.modelProfile?.metadata?.image && (
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          featuredDrop.modelProfile.metadata.image?.split(
                            "ipfs://"
                          )?.[1]
                        }`}
                        alt={
                          featuredDrop.modelProfile.metadata.title ||
                          "Model"
                        }
                        layout="fill"
                        objectFit="cover"
                        draggable={false}
                        className="border-2 border-gray-800 rounded-full"
                      />
                    </div>
                  )}
                  <div className="relative flex flex-col">
                    <div className="text-xs text-gray-600">
                      {dict?.modelLabel}
                    </div>
                    <div className="text-sm font-bold">
                      {featuredDrop?.modelProfile?.metadata?.title ||
                        `${featuredDrop?.modelProfile?.wallet?.slice(
                          0,
                          6
                        )}...${featuredDrop?.modelProfile?.wallet?.slice(
                          -4
                        )}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex w-full h-[40rem] mid:h-full">
              <div className="absolute top-0 left-0 w-full h-full flex">
                <Image
                  src={"/images/fuzzy.png"}
                  draggable={false}
                  layout="fill"
                  alt="Fuzzy"
                  objectFit="cover"
                  className="opacity-30"
                />
              </div>
              <div className="relative w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 overflow-y-auto">
                {collections
                  .filter((col) => col.drop?.dropId === featuredDrop?.dropId)
                  .map((collection: Collection) => (
                    <div
                      key={collection.collectionId}
                      className="relative w-full aspect-[3/4] cursor-pointer hover:scale-105 transition-transform duration-300"
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
                          className="w-full h-full object-cover border-2 border-gray-800"
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
                          src={`${INFURA_GATEWAY}/ipfs/${
                            collection.metadata?.media?.split("ipfs://")?.[1]
                          }`}
                          alt={collection.metadata?.title}
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                          className="border-2 border-gray-800"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2">
                        <div className="text-xs font-bold truncate">
                          {collection.metadata?.title}
                        </div>
                        <div className="text-xs">
                          {Number(collection.price) / 10 ** 18} MONA
                        </div>
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/collection/${collection.collectionContract}/${collection.collectionId}`
                              );
                            }}
                            className="bg-pink-600 text-white text-xs px-2 py-1 hover:bg-pink-700"
                          >
                            {dict?.ver}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(collection, 1);
                            }}
                            className="bg-yellow-500 text-black text-xs px-2 py-1 hover:bg-yellow-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      {collection.tokenIds?.length >=
                        parseInt(collection.edition) && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1">
                          {dict?.soldOut}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="relative font-ric w-full h-fit flex flex-col bg-gray-800 gap-6 p-6">
        <div className="relative text-white text-[2rem] galaxy:text-[4rem] sm:text-[6rem] mid:text-[8rem] lg:text-[10rem] xl:text-[12rem] flex w-full h-fit items-end justify-end">
          {dict?.marketTitle}
        </div>
        <div className="relative w-full h-fit flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="relative w-full text-xl text-left h-fit text-white tracking-widest">
            <div className="relative w-full md:w-1/2">
              {dict?.exploreCollections}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div ref={dropdownRef} className="relative w-full md:w-auto">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative w-full md:w-auto flex flex-row items-center justify-between gap-4 bg-white text-black px-4 py-2 border-2 border-gray-800 text-sm hover:bg-gray-100 transition-colors whitespace-nowrap break-all"
              >
                <span className="relative w-fit h-fit flex">
                  {selectedDrop === "all" ? dict?.allDrops : selectedDrop}
                </span>
                <svg
                  className={`relative w-4 h-4 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 w-full md:w-64 mt-1 bg-white border-2 border-gray-800 shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      setSelectedDrop("all");
                      setDropdownOpen(false);
                    }}
                    className="relative w-full h-fit flex px-4 py-2 text-sm hover:bg-pink-600 hover:text-white cursor-pointer transition-colors border-b border-gray-200"
                  >
                    {dict?.allDrops}
                  </div>
                  {drops.map((drop) => (
                    <div
                      key={drop}
                      onClick={() => {
                        setSelectedDrop(drop);
                        setDropdownOpen(false);
                      }}
                      className="relative w-full h-fit flex px-4 py-2 text-sm hover:bg-pink-600 hover:text-white cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                    >
                      {drop}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-fit flex flex-col bg-white pb-4">
        <div className="relative w-full h-8 flex">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src="/videos/digitalax-globalmodelssyndicate-stitch.mp4" />
          </video>
        </div>
        <div className="w-full h-1 bg-gray-800 flex relative"></div>

        <div className="relative w-full flex py-16 px-4 flex-col gap-2">
          <div className="relative w-full h-fit flex flex-col gap-3 sm:flex-row flex-wrap justify-center sm:justify-between items-center">
            <div className="relative w-full sm:w-60 flex text-left font-role text-black text-lg">
              {collectionsLoading
                ? dict?.loading
                : `${filteredCollections?.length} ${dict?.collectionsAvailable}`}
            </div>
            <div className="relative h-fit flex font-ric w-full sm:w-80 text-right text-sm">
              {selectedDrop !== "all" ? selectedDrop : dict?.globalExploration}
            </div>
          </div>
        </div>

        <div className="relative w-full h-fit flex flex-col gap-2 px-6">
          <div className="relative w-full h-fit grid items-center justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {collectionsLoading ? (
              <div className="col-span-full text-center py-8">
                {dict?.loadingCollections}
              </div>
            ) : (
              filteredCollections?.map((collection: Collection) => (
                <div
                  key={collection.collectionId}
                  className="relative w-full h-40 sm:h-48 cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() =>
                    router.push(
                      `/collection//${collection.collectionContract}/${collection.collectionId}`
                    )
                  }
                >
                  {collection.metadata?.mediaType === "mp4" ? (
                    <video
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover border-2 border-gray-800"
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
                      className="border-2 border-gray-800"
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
                      {dict?.edition} {collection.edition}
                    </div>
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/collection/${collection.collectionContract}/${collection.collectionId}`
                          );
                        }}
                        className="bg-pink-600 text-white text-xs px-2 py-1 hover:bg-pink-700"
                      >
                        {dict?.ver}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(collection, 1);
                        }}
                        className="bg-yellow-500 text-black text-xs px-2 py-1 hover:bg-yellow-600"
                      >
                        +
                      </button>
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
              ))
            )}
          </div>

          <div className="relative w-full flex justify-center py-6">
            <button
              onClick={loadMore}
              disabled={collectionsLoading}
              className="bg-black text-white px-6 py-2 border-2 border-gray-800 hover:bg-white hover:text-black transition-colors duration-300 disabled:opacity-50"
            >
              {collectionsLoading ? dict?.loading : dict?.loadMore}
            </button>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default MarketEntry;
