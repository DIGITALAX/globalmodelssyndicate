"use client";

import { FunctionComponent, useState } from "react";
import { DesignerSelectProps } from "../types/account.types";
import { Designer } from "../../Model/types/model.types";

const DesignerSelect: FunctionComponent<DesignerSelectProps> = ({
  dict,
  designers,
  designersLoading,
  selected,
  onChange,
}) => {
  const [manualId, setManualId] = useState<string>("");

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id]
    );
  };

  const addManual = () => {
    const id = manualId.trim();
    if (/^\d+$/.test(id) && Number(id) > 0) {
      const normalized = String(Number(id));
      if (!selected.includes(normalized)) {
        onChange([...selected, normalized]);
      }
    }
    setManualId("");
  };

  const unlisted = selected.filter(
    (id) =>
      !designers.some((designer) => String(designer?.designerId) === id)
  );

  return (
    <div className="relative w-full h-fit flex flex-col gap-2">
      <div className="relative w-fit h-fit flex text-sm font-bold">
        {dict?.designersRequired}
      </div>
      <div className="relative w-full h-fit max-h-40 overflow-y-auto flex flex-row flex-wrap gap-2">
        {designersLoading && (
          <div className="relative w-fit h-fit flex text-xs text-gray-500">
            {dict?.loadingDesignerList}
          </div>
        )}
        {!designersLoading && designers.length === 0 && (
          <div className="relative w-fit h-fit flex text-xs text-gray-500">
            {dict?.noDesignersLoaded}
          </div>
        )}
        {designers.map((designer: Designer) => {
          const id = String(designer?.designerId);
          const active = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`relative w-fit h-fit flex px-2 py-1 border border-black text-xs transition-colors ${
                active
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              {designer?.metadata?.title
                ? `${designer?.metadata?.title} (#${id})`
                : `#${id}`}
            </button>
          );
        })}
        {unlisted.map((id) => (
          <button
            key={`unlisted-${id}`}
            type="button"
            onClick={() => toggle(id)}
            className="relative w-fit h-fit flex px-2 py-1 border border-black text-xs bg-black text-white"
          >
            {`#${id}`}
          </button>
        ))}
      </div>
      <div className="relative w-full h-fit flex flex-row flex-wrap gap-2 items-center">
        <input
          type="number"
          min={1}
          step={1}
          value={manualId}
          onChange={(e) => setManualId(e.target.value)}
          placeholder={dict?.designerIdPlaceholder}
          className="relative w-40 h-fit flex p-2 border border-black text-xs"
        />
        <button
          type="button"
          onClick={addManual}
          className="relative w-fit h-fit flex bg-white text-black px-3 py-2 border border-black text-xs hover:bg-gray-100 transition-colors"
        >
          {dict?.addDesignerId}
        </button>
      </div>
    </div>
  );
};

export default DesignerSelect;
