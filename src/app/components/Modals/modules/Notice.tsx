"use client";

import { ModalContext } from "@/app/providers";
import { NOTICE_URL, NOTICE_URL_LABEL } from "@/app/lib/constants";
import { useContext } from "react";

const Notice = ({ dict }: { dict: any }) => {
  const context = useContext(ModalContext);

  if (!context?.noticeOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="relative bg-white max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="relative border-b-2 border-black p-4 flex flex-row justify-end items-center">
          <button
            onClick={context.hideNotice}
            className="text-2xl hover:bg-gray-200 w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="relative flex flex-1 overflow-y-auto p-4">
          <p className="text-gray-800 break-words">
            {dict?.contractNotice}{" "}
            <a
              href={NOTICE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70"
            >
              {NOTICE_URL_LABEL}
            </a>
            .
          </p>
        </div>

        <div className="relative flex border-t-2 border-black p-4 bg-gray-50">
          <button
            onClick={context.hideNotice}
            className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
          >
            {dict?.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notice;
