"use client";

import { FunctionComponent, useState, useRef } from "react";
import useAccount from "../hooks/useAccount";
import Image from "next/image";
import { CuentaTabProps } from "../types/account.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const CuentaTab: FunctionComponent<CuentaTabProps> = ({
  dict,
  model,
  verified,
}) => {
  const {
    handleRegister,
    handleUpdate,
    handleDelete,
    transferWallet,
    registerLoading,
    updateLoading,
    deleteLoading,
    transferLoading,
    modelData,
    setModelData,
  } = useAccount(model, verified, dict);

  const [isEditing, setIsEditing] = useState(!model);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelData({ ...modelData, [type]: file });
    }
  };

  const canDelete = model && Number(model?.totalSales) === 0;

  if (!model && !isEditing) {
    return (
      <div className="p-6 border-2 border-gray-200 bg-gray-50">
        <div className="text-center py-8">
          <div className="text-lg font-bold mb-4">
            {dict?.noModelProfile}
          </div>
          <div className="text-gray-600 mb-6">{dict?.notVerified}</div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            {dict?.createModelProfile}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {model && !isEditing && (
        <div className="border-2 border-black p-6 bg-white">
          <div className="flex justify-between items-start mb-6 flex-row flex-wrap">
            <h3 className="text-xl font-bold">{dict?.modelProfile}</h3>
            <div className="flex gap-2 flex-wrap flex-row">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition-colors"
              >
                {dict?.editProfile}
              </button>
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="bg-red-600 text-white px-4 py-2 text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteLoading ? dict?.deleting : dict?.deleteProfile}
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  {dict?.profileImage}
                </label>
                <div className="relative w-32 h-32">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${model?.metadata?.image?.replace(
                      "ipfs://",
                      ""
                    )}`}
                    alt={model?.metadata?.title}
                    layout="fill"
                    draggable={false}
                    objectFit="cover"
                    className="border-2 border-black"
                  />
                </div>
              </div>

              {model?.metadata?.cover && (
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">
                    {dict?.coverImage}
                  </label>
                  <div className="relative w-full h-32">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${model?.metadata?.cover?.replace(
                        "ipfs://",
                        ""
                      )}`}
                      alt={`${model?.metadata?.title} cover`}
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                      className="border-2 border-black"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  {dict?.title}
                </label>
                <div className="p-3 bg-gray-100">
                  {model?.metadata?.title}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  {dict?.description}
                </label>
                <div className="p-3 bg-gray-100">
                  {model?.metadata?.description}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  {dict?.website}
                </label>
                <div className="p-3 bg-gray-100">
                  {model?.metadata?.link ? (
                    <a
                      href={model?.metadata?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {model?.metadata?.link}
                    </a>
                  ) : (
                    dict?.notProvided
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  {dict?.statistics}
                </label>
                <div className="flex flex-row flex-wrap gap-4 text-sm">
                  <div className="p-2 bg-gray-100 w-full flex gap-2">
                    <div className="font-bold">{dict?.totalSales}</div>
                    <div>{Number(model?.totalSales) / 10 ** 18} MONA</div>
                  </div>
                  <div className="p-2 bg-gray-100 w-full flex gap-2">
                    <div className="font-bold">{dict?.uniqueBuyers}</div>
                    <div>{model?.uniqueBuyers ?? 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="border-2 border-black p-6 bg-white">
          <div className="flex justify-between items-start mb-6 flex-row flex-wrap">
            <h3 className="text-xl font-bold">
              {model
                ? dict?.editModelProfile
                : dict?.createModelProfile}
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-black"
            >
              {dict?.cancel}
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">
                    {dict?.profileImageRequired}
                  </label>
                  <div className="space-y-2">
                    {(modelData.image || model?.metadata?.image) && (
                      <div className="relative w-32 h-32">
                        <Image
                          src={
                            typeof modelData.image === "string"
                              ? modelData.image.startsWith("ipfs://")
                                ? `${INFURA_GATEWAY}/ipfs/${modelData.image?.replace(
                                    "ipfs://",
                                    ""
                                  )}`
                                : modelData.image
                              : modelData.image
                              ? URL.createObjectURL(modelData.image as File)
                              : `${INFURA_GATEWAY}/ipfs/${model?.metadata?.image?.replace(
                                  "ipfs://",
                                  ""
                                )}`
                          }
                          draggable={false}
                          alt="Profile preview"
                          layout="fill"
                          objectFit="cover"
                          className="border-2 border-black"
                        />
                      </div>
                    )}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "image")}
                      className="block w-full text-sm border-2 border-black p-2"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">
                    {dict?.coverImageOptional}
                  </label>
                  <div className="space-y-2">
                    {(modelData.cover || model?.metadata?.cover) && (
                      <div className="relative w-full h-32">
                        <Image
                          draggable={false}
                          src={
                            typeof modelData.cover === "string"
                              ? modelData.cover.startsWith("ipfs://")
                                ? `${INFURA_GATEWAY}/ipfs/${modelData.cover?.replace(
                                    "ipfs://",
                                    ""
                                  )}`
                                : modelData.cover
                              : modelData.cover
                              ? URL.createObjectURL(modelData.cover as File)
                              : `${INFURA_GATEWAY}/ipfs/${model?.metadata?.cover?.replace(
                                  "ipfs://",
                                  ""
                                )}`
                          }
                          alt="Cover preview"
                          layout="fill"
                          objectFit="cover"
                          className="border-2 border-black"
                        />
                      </div>
                    )}
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "cover")}
                      className="block w-full text-sm border-2 border-black p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {dict?.titleRequired}
                  </label>
                  <input
                    type="text"
                    value={modelData.title}
                    onChange={(e) =>
                      setModelData({
                        ...modelData,
                        title: e.target.value,
                      })
                    }
                    className="w-full p-3 border-2 border-black"
                    placeholder={dict?.modelName}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    {dict?.descriptionRequired}
                  </label>
                  <textarea
                    value={modelData.description}
                    onChange={(e) =>
                      setModelData({
                        ...modelData,
                        description: e.target.value,
                      })
                    }
                    className="w-full p-3 border-2 border-black h-24 resize-none"
                    placeholder={dict?.designPhilosophy}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    {dict?.websiteOptional}
                  </label>
                  <input
                    type="url"
                    value={modelData.link}
                    onChange={(e) =>
                      setModelData({ ...modelData, link: e.target.value })
                    }
                    className="w-full p-3 border-2 border-black"
                    placeholder={dict?.websiteUrl}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={model ? handleUpdate : handleRegister}
                disabled={registerLoading || updateLoading}
                className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {registerLoading || updateLoading
                  ? model
                    ? dict?.updating
                    : dict?.creating
                  : model
                  ? dict?.updateProfile
                  : dict?.createProfile}
              </button>
            </div>
          </form>

          {model && (
            <div className="relative w-full flex flex-col mt-8 pt-8 border-t-2 border-gray-200">
              <h4 className="relative w-fit text-lg font-bold mb-4 text-red-600">
                {dict?.dangerZone}
              </h4>
              <div className="relative w-full flex flex-col bg-red-50 border-2 border-red-200 p-6 gap-4">
                <p className="relative w-full flex text-sm text-gray-700">
                  {dict?.transferWarning}
                </p>
                <div className="relative w-full flex flex-col">
                  <label className="relative w-fit flex text-sm font-bold mb-2">
                    {dict?.newOwnerWallet}
                  </label>
                  <input
                    type="text"
                    value={modelData.transferWallet || ""}
                    onChange={(e) =>
                      setModelData({
                        ...modelData,
                        transferWallet: e.target.value,
                      })
                    }
                    className="relative w-full flex p-3 border-2 border-red-300 focus:border-red-500"
                    placeholder="0x..."
                  />
                </div>
                <button
                  onClick={transferWallet}
                  disabled={transferLoading || !modelData?.transferWallet}
                  className="relative w-full flex items-center justify-center bg-red-600 text-white px-6 py-3 hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {transferLoading
                    ? dict?.transferring
                    : dict?.transferOwnership}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CuentaTab;
