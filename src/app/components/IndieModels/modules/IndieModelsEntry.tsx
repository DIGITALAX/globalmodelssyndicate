"use client";
import { FunctionComponent } from "react";
import Header from "../../Common/modules/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useModels from "../hooks/useModels";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { Model } from "../../Model/types/model.types";

const IndieModelsEntry: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const router = useRouter();
  const { modelsLoading, models, loadMore } = useModels();
  return (
    <div className="relative flex flex-col">
      <Header dict={dict} />
      <div className="relative font-ric w-full h-fit flex flex-col bg-gray-800 gap-6 p-6">
        <div className="relative text-white text-[2rem] sm:text-[4rem] mid:text-[6rem] lg:text-[10rem] flex w-full h-fit items-end justify-end">
          {dict?.indieModelsTitle}
        </div>
      </div>
      <div className="relative w-full h-8 flex">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src="/videos/digitalax-globalmodelssyndicate-stitch.mp4" />
        </video>
      </div>
      <div className="w-full h-1 bg-gray-800 flex relative"></div>
      <div className="relative font-ric w-full h-fit flex flex-col bg-gray-50 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {modelsLoading && models?.length === 0 ? (
            <div className="col-span-full text-center text-gray-800 py-8">
              {dict?.loadingModels}
            </div>
          ) : (
            models?.map((model: Model, index: number) => (
              <div
                key={model?.modelId}
                className={`relative cursor-pointer bg-white shadow-harsh transform ${
                  index % 4 === 0
                    ? "rotate-1"
                    : index % 4 === 1
                    ? "-rotate-2"
                    : index % 4 === 2
                    ? "rotate-2"
                    : "-rotate-1"
                } hover:scale-105 transition-transform duration-300 torn-photo-edge`}
                onClick={() => router.push(`/model/${model?.wallet}`)}
              >
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      model?.metadata?.image?.split("ipfs://")?.[1]
                    }`}
                    alt={model?.metadata?.title}
                    layout="fill"
                    draggable={false}
                    objectFit="cover"
                    className="grayscale contrast-150"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 transform rotate-12 shadow-harsh">
                    W3F: {Number(model?.w3fReceived) / 10 ** 18}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2 ransom-note-typography">
                    <span className="cut-out-letter break-all text-center bg-black text-white shadow-harsh">
                      {model?.metadata?.title}
                    </span>
                  </h3>

                  <div className="mb-2">
                    <span className="bg-pink-600 text-white text-xs px-2 py-1 transform -rotate-1 inline-block shadow-harsh">
                      {dict?.web3Model}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="bg-yellow-500 text-black text-xs px-1 py-0.5 transform rotate-1">
                      {dict?.sales}: {Number(model?.totalSales) / 10 ** 18}
                    </span>
                    <span className="bg-gray-800 text-white text-xs px-1 py-0.5 transform -rotate-1">
                      {dict?.buyers}: {model?.uniqueBuyers ?? 0}
                    </span>
                  </div>

                  <div className="flex gap-2 text-xs">
                    {model?.metadata?.link && (
                      <span className="bg-white text-black border border-gray-800 px-1 py-0.5 transform rotate-1">
                        {dict?.link}
                      </span>
                    )}
                    <span className="bg-pink-600 text-white px-1 py-0.5 transform -rotate-1">
                      {model?.drops?.length ?? 0} {dict?.dropsCount}
                    </span>
                  </div>

                  <div className="mt-3 text-xs">
                    <span className="font-cyn bg-gray-100 px-1 py-0.5 text-gray-600">
                      {model?.wallet.slice(0, 6)}...
                      {model?.wallet.slice(-4)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="relative w-full flex justify-center py-6">
          <button
            onClick={loadMore}
            disabled={modelsLoading}
            className="bg-gray-800 text-white px-6 py-2 border-2 border-gray-800 hover:bg-white hover:text-gray-800 transition-colors duration-300 disabled:opacity-50"
          >
            {modelsLoading ? dict?.loading : dict?.loadMoreModels}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndieModelsEntry;
