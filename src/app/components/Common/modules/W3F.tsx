"use client";

import { FunctionComponent, useEffect } from "react";
import useW3F from "../hooks/useW3F";

const W3F: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const {
    w3fStats,
    recentTransactions,
    loading,
    activeTab,
    setActiveTab,
    glitchEffect,
    setGlitchEffect,
  } = useW3F();

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 200);
    }, 8000);
    return () => clearInterval(interval);
  }, [setGlitchEffect]);

  return (
    <div className="relative font-ric w-full bg-gray-50 overflow-hidden">
      <div className="relative w-full">
        <div className="w-full h-1 bg-gray-800"></div>

        <div className="relative px-6 py-16 md:px-12 lg:px-20">
          <div className="relative mb-12 text-center">
            <div
              className={`relative inline-block ${
                glitchEffect ? "animate-pulse" : ""
              }`}
            >
              <h2 className="relative text-5xl md:text-7xl text-gray-800">
                <span className="inline-block">$W3F</span>
              </h2>
            </div>
            <div className="mt-6 max-w-3xl mx-auto">
              <div className="bg-white p-6 shadow-xl border border-gray-200">
                <p className="text-gray-800 text-lg mb-2">{dict?.w3fTitle}</p>
                <p className="text-gray-600 text-base">{dict?.w3fDesc}</p>
                <p className="text-gray-600 text-base mt-4">{dict?.soon}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mb-12">
            {["stats", "activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`
                  px-6 py-3 uppercase text-sm transition-all
                  ${
                    activeTab === tab
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                  }
                `}
              >
                {tab === "stats" ? dict?.w3fStats : dict?.w3fActivity}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === "stats" && (
                <div className="flex flex-col items-center gap-2 justify-center">
                  <div className="bg-white p-12 shadow-xl border border-gray-200 max-w-lg">
                    <div className="text-gray-800 text-center">
                      <div className="text-sm uppercase mb-4 text-gray-500">
                        {dict?.w3fTotalSupply}
                      </div>
                      <div className="text-5xl mb-3 text-gray-800">
                        {(
                          parseInt(w3fStats.totalSupply) / 1e18
                        ).toLocaleString()}
                      </div>
                      <div className="text-base text-gray-600">
                        {dict?.w3fTokens}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="space-y-8">
                  <div className="bg-white shadow-xl border border-gray-200 p-6">
                    <h3 className="text-gray-800 text-xl mb-6">
                      {dict?.w3fRecentTx}
                    </h3>
                    <div className="space-y-4">
                      {recentTransactions.map((tx, i) => (
                        <div
                          key={i}
                          className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                              <div
                                className={`
                                px-3 py-1 text-xs uppercase
                                ${
                                  tx.type === "MINT"
                                    ? "bg-gray-100 text-gray-800"
                                    : tx.type === "BURN"
                                    ? "bg-gray-200 text-gray-800"
                                    : "bg-gray-800 text-white"
                                }
                              `}
                              >
                                {tx.type}
                              </div>
                              <div className="text-gray-800 font-medium">
                                {(parseInt(tx.amount) / 1e18).toLocaleString()}{" "}
                                W3F
                              </div>
                            </div>
                            <div className="text-gray-500 text-sm font-mono">
                              {dict?.w3fBlock} #{tx.blockNumber}
                            </div>
                          </div>
                          <div className="text-gray-400 text-sm mt-2 font-mono">
                            {tx.from.slice(0, 6)}...{tx.from.slice(-4)} →{" "}
                            {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="w-full h-1 bg-gray-800"></div>
      </div>
    </div>
  );
};

export default W3F;
