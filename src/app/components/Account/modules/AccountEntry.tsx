"use client";

import { FunctionComponent, useState } from "react";
import { useAccount as useWalletAccount } from "wagmi";
import Header from "../../Common/modules/Header";
import PurchasesSection from "./PurchasesSection";
import ModelSection from "./ModelSection";
import useModel from "../hooks/useModel";

const AccountEntry: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const { address, isConnected } = useWalletAccount();
  const [activeTab, setActiveTab] = useState<"purchases" | "model">(
    "purchases"
  );
  const { model, verified } = useModel(dict);

  return (
    <div className="relative flex flex-col min-h-screen">
      <Header dict={dict} />

      <div className="relative font-ric w-full h-fit flex flex-col bg-gray-800 gap-6 p-6">
        <div className="relative text-white text-[2rem] galaxy:text-[4rem] sm:text-[6rem] mid:text-[8rem] lg:text-[10rem] xl:text-[12rem] flex w-full h-fit items-end justify-end">
          {dict?.accountTitle}
        </div>

        <div className="relative w-full h-fit flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="relative w-full text-xl text-left h-fit text-white tracking-widest">
            <div className="relative w-full md:w-1/2">
              {dict?.manageAccount}
            </div>
          </div>

          {isConnected && address && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab("purchases")}
                className={`px-4 py-2 text-sm transition-colors ${
                  activeTab === "purchases"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {dict?.purchasesTab}
              </button>
              <button
                onClick={() => setActiveTab("model")}
                className={`px-4 py-2 text-sm transition-colors ${
                  activeTab === "model"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {dict?.modelTab}
              </button>
            </div>
          )}
        </div>
      </div>

      {isConnected && address ? (
        <div className="flex-1 bg-white">
          {activeTab === "purchases" && <PurchasesSection dict={dict} />}
          {activeTab === "model" && (
            <ModelSection dict={dict} verified={verified} model={model} />
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {dict?.connectWallet}
            </h2>
            <p className="text-gray-600">{dict?.connectWalletDesc}</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountEntry;
