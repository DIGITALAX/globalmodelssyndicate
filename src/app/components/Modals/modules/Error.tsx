"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";

const Error = ({ dict }: { dict: any }) => {
  const context = useContext(ModalContext);

  if (!context?.errorData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="border-b-2 border-black p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{dict?.error}</h2>
          <button
            onClick={context.hideError}
            className="text-2xl hover:bg-gray-200 w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-800 whitespace-pre-wrap break-words">
            {context.errorData.message}
          </p>
        </div>

        <div className="border-t-2 border-black p-4 bg-gray-50">
          <button
            onClick={context.hideError}
            className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
          >
            {dict?.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
