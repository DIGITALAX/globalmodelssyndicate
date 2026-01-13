"use client";

import { FunctionComponent, useState } from "react";
import CuentaTab from "./CuentaTab";
import CreateTab from "./CreateTab";
import { ModelSectionProps } from "../types/account.types";

const ModelSection: FunctionComponent<ModelSectionProps> = ({
  dict,
  verified,
  model,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"cuenta" | "create">(
    "cuenta"
  );

  if (!verified) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-xl font-bold mb-4">
            {dict?.modelAccessRequired}
          </div>
          <div className="text-gray-600 mb-6">{dict?.needVerified}</div>
          <div className="bg-gray-100 p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-700">{dict?.becomeModel}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{dict?.modelDashboard}</h2>
        <p className="text-gray-600">{dict?.manageModel}</p>
      </div>

      <div className="flex gap-4 mb-6 border-b flex-wrap">
        <button
          onClick={() => setActiveSubTab("cuenta")}
          className={`pb-2 px-1 border-b-2 transition-colors ${
            activeSubTab === "cuenta"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          {dict?.cuentaTab}
        </button>
        <button
          onClick={() => setActiveSubTab("create")}
          className={`pb-2 px-1 border-b-2 transition-colors ${
            activeSubTab === "create"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          {dict?.createTab}
        </button>
      </div>

      <div>
        {activeSubTab === "cuenta" && (
          <CuentaTab dict={dict} model={model} verified={verified} />
        )}
        {activeSubTab === "create" && <CreateTab dict={dict} model={model} />}
      </div>
    </div>
  );
};

export default ModelSection;
