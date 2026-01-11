"use client";

import { getCurrentNetwork } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { useContext } from "react";

const Success = ({ dict }: { dict: any }) => {
  const context = useContext(ModalContext);

  if (!context?.successData) return null;

  const network = getCurrentNetwork();
  const explorerUrl = context.successData.txHash
    ? `${network.blockExplorer}/tx/${context.successData.txHash}`
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="border-b-2 border-black p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{dict?.success}</h2>
          <button
            onClick={context.hideSuccess}
            className="text-2xl hover:bg-gray-200 w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-800 mb-4">{context.successData.message}</p>

          {context.successData.txHash && (
            <div className="bg-gray-50 border border-gray-200 p-3 mb-4">
              <p className="text-sm font-bold mb-2">{dict?.txHash}</p>
              {explorerUrl ? (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-blue-600 hover:underline break-all"
                >
                  {context.successData.txHash}
                </a>
              ) : (
                <p className="text-xs font-mono text-gray-600 break-all">
                  {context.successData.txHash}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="border-t-2 border-black p-4 bg-gray-50">
          <button
            onClick={context.hideSuccess}
            className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
          >
            {dict?.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
