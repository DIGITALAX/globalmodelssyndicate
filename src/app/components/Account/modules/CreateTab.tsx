"use client";

import { FunctionComponent, useState, useRef, useEffect } from "react";
import useCreate from "../hooks/useCreate";
import Image from "next/image";
import { CreateTabProps } from "../types/account.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { Collection, Drop } from "../../Model/types/model.types";

const CreateTab: FunctionComponent<CreateTabProps> = ({ dict, model }) => {
  const {
    handleCreateDrop,
    handleAddCollection,
    handleDeleteCollection,
    handleDeleteDrop,
    handleReassignCollection,
    createDropLoading,
    addCollectionLoading,
    deleteCollectionLoading,
    deleteDropLoading,
    reassignLoading,
    drop,
    setDrop,
    collection,
    setCollection,
    collections,
    setCollections,
  } = useCreate(model, dict);

  const [activeSection, setActiveSection] = useState<
    "create-drop" | "add-collection" | "manage"
  >("create-drop");
  const [selectedDropId, setSelectedDropId] = useState<number | null>(null);
  const [reassignData, setReassignData] = useState<{
    collectionId: number | null;
    newDropId: number | null;
  }>({ collectionId: null, newDropId: null });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reassignDropdownOpen, setReassignDropdownOpen] = useState<
    number | null
  >(null);

  const dropImageRef = useRef<HTMLInputElement>(null);
  const collectionMediaRef = useRef<HTMLInputElement>(null);
  const addCollectionMediaRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const reassignDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        reassignDropdownRef.current &&
        !reassignDropdownRef.current.contains(event.target as Node)
      ) {
        setReassignDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddCollectionToList = () => {
    if (
      collection &&
      collection?.metadata?.title &&
      collection?.metadata?.description &&
      collection?.metadata?.media &&
      collection?.amount > 0 &&
      collection?.price > 0
    ) {
      setCollections([...collections, collection]);
      setCollection(undefined);
      if (addCollectionMediaRef.current) {
        addCollectionMediaRef.current.value = "";
      }
    }
  };

  const handleRemoveFromList = (index: number) => {
    setCollections(collections.filter((_, i) => i !== index));
  };

  if (!model) {
    return (
      <div className="p-6 text-center">
        <div className="text-lg font-bold mb-4">{dict?.noModelProfile}</div>
        <div className="text-gray-600">{dict?.createProfileFirst}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b flex-wrap">
        <button
          onClick={() => setActiveSection("create-drop")}
          className={`pb-2 px-1 border-b-2 transition-colors text-sm ${
            activeSection === "create-drop"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          {dict?.createDropTab}
        </button>
        <button
          onClick={() => setActiveSection("add-collection")}
          className={`pb-2 px-1 border-b-2 transition-colors text-sm ${
            activeSection === "add-collection"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          {dict?.addCollectionTab}
        </button>
        <button
          onClick={() => setActiveSection("manage")}
          className={`pb-2 px-1 border-b-2 transition-colors text-sm ${
            activeSection === "manage"
              ? "border-black text-black"
              : "border-transparent text-gray-500 hover:text-black"
          }`}
        >
          {dict?.manageTab}
        </button>
      </div>

      {activeSection === "create-drop" && (
        <div className="border-2 border-black p-6 bg-white">
          <h3 className="text-xl font-bold mb-6">{dict?.createNewDrop}</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  {dict?.dropTitle}
                </label>
                <input
                  type="text"
                  value={drop?.title || ""}
                  onChange={(e) =>
                    setDrop({
                      ...drop!,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-3 border-2 border-black"
                  placeholder={dict?.enterDropTitle}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  {dict?.descriptionRequired}
                </label>
                <textarea
                  value={drop?.description || ""}
                  onChange={(e) =>
                    setDrop({
                      ...drop!,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border-2 border-black h-24 resize-none"
                  placeholder={dict?.describeYourDrop}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  {dict?.dropImage}
                </label>
                <input
                  ref={dropImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setDrop({
                        ...drop!,
                        image: file,
                      });
                    }
                  }}
                  className="block w-full text-sm border-2 border-black p-2"
                />
                {drop?.image && (
                  <div className="mt-2 relative w-32 h-32">
                    <Image
                      src={URL.createObjectURL(drop?.image)}
                      alt="Drop preview"
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                      className="border border-black"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">
                {dict?.initialCollections}
              </h4>
              <div className="space-y-4 mb-4">
                <div className="flex flex-row gap-2 flex-wrap">
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      {dict?.title}
                    </label>
                    <input
                      type="text"
                      value={collection?.metadata?.title || ""}
                      onChange={(e) =>
                        setCollection({
                          ...collection!,
                          metadata: {
                            ...collection?.metadata!,
                            title: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-black text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      {dict?.price}
                    </label>
                    <input
                      type="number"
                      value={collection?.price || ""}
                      onChange={(e) =>
                        setCollection({
                          ...collection!,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-black text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-2 flex-wrap">
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      {dict?.editionSize}
                    </label>
                    <input
                      type="number"
                      value={collection?.amount || ""}
                      onChange={(e) =>
                        setCollection({
                          ...collection!,
                          amount: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 border border-black text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">
                      {dict?.media}
                    </label>
                    <input
                      ref={collectionMediaRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCollection({
                            ...collection!,
                            metadata: {
                              ...collection?.metadata!,
                              media: file,
                            },
                          });
                        }
                      }}
                      className="w-full p-1 border border-black text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">
                    {dict?.description}
                  </label>
                  <textarea
                    value={collection?.metadata?.description || ""}
                    onChange={(e) =>
                      setCollection({
                        ...collection!,

                        metadata: {
                          ...collection?.metadata!,
                          description: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border border-black text-sm h-16 resize-none"
                  />
                </div>

                <button
                  onClick={handleAddCollectionToList}
                  className="bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition-colors"
                >
                  {dict?.addToDrop}
                </button>
              </div>

              {collections.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-bold text-sm">
                    {dict?.collectionsToCreate} ({collections?.length})
                  </h5>
                  {collections.map((col, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-100 text-sm"
                    >
                      <span>
                        {col?.metadata.title} - {col?.amount} {dict?.items} @{" "}
                        {col?.price} MONA
                      </span>
                      <button
                        onClick={() => handleRemoveFromList(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        {dict?.remove}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleCreateDrop}
              disabled={
                createDropLoading ||
                !drop?.title ||
                !drop?.description ||
                !drop?.image
              }
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {createDropLoading ? dict?.creatingDrop : dict?.createDrop}
            </button>
          </div>
        </div>
      )}

      {activeSection === "add-collection" && (
        <div className="border-2 border-black p-6 bg-white">
          <h3 className="text-xl font-bold mb-6">
            {dict?.addCollectionToExistingDrop}
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">
              {dict?.selectDrop}
            </label>
            <div ref={dropdownRef} className="relative w-full">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative w-full flex flex-row items-center justify-between gap-4 bg-white text-black px-4 py-3 border-2 border-black text-sm hover:bg-gray-100 transition-colors"
              >
                <span className="relative w-fit h-fit flex">
                  {selectedDropId
                    ? model?.drops?.find(
                        (d: Drop) => Number(d.dropId) === selectedDropId
                      )?.metadata.title
                    : dict?.chooseADrop}
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
                <div className="absolute top-full left-0 w-full mt-1 bg-white border-2 border-black shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      setSelectedDropId(null);
                      setDropdownOpen(false);
                    }}
                    className="relative w-full h-fit flex px-4 py-2 text-sm hover:bg-pink-600 hover:text-white cursor-pointer transition-colors border-b border-gray-200"
                  >
                    {dict?.chooseADrop}
                  </div>
                  {model?.drops?.map((drop: Drop) => (
                    <div
                      key={drop?.dropId}
                      onClick={() => {
                        setSelectedDropId(Number(drop?.dropId));
                        setDropdownOpen(false);
                      }}
                      className="relative w-full h-fit flex px-4 py-2 text-sm hover:bg-pink-600 hover:text-white cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                    >
                      {drop?.metadata?.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {selectedDropId && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {dict?.collectionTitle}
                  </label>
                  <input
                    type="text"
                    value={collection?.metadata?.title || ""}
                    onChange={(e) =>
                      setCollection({
                        ...collection!,
                        metadata: {
                          ...collection?.metadata!,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full p-3 border-2 border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    {dict?.descriptionRequired}
                  </label>
                  <textarea
                    value={collection?.metadata?.description || ""}
                    onChange={(e) =>
                      setCollection({
                        ...collection!,

                        metadata: {
                          ...collection?.metadata!,
                          description: e.target.value,
                        },
                      })
                    }
                    className="w-full p-3 border-2 border-black h-24 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      {dict?.editionSizeRequired}
                    </label>
                    <input
                      type="number"
                      value={collection?.amount || ""}
                      onChange={(e) =>
                        setCollection({
                          ...collection!,
                          amount: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 border-2 border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      {dict?.priceRequired}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={collection?.price || ""}
                      onChange={(e) =>
                        setCollection({
                          ...collection!,
                          price: Number(e.target.value),
                        })
                      }
                      className="w-full p-3 border-2 border-black"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    {dict?.mediaRequired}
                  </label>
                  <input
                    ref={addCollectionMediaRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCollection({
                          ...collection!,

                          metadata: {
                            ...collection?.metadata!,
                            media: file,
                          },
                        });
                      }
                    }}
                    className="w-full p-3 border-2 border-black"
                  />
                  {collection?.metadata?.media && (
                    <div className="mt-2 relative w-32 h-32">
                      {collection?.metadata?.media?.type?.startsWith(
                        "video/"
                      ) ? (
                        <video
                          src={URL.createObjectURL(collection?.metadata?.media)}
                          className="w-full h-full object-cover border border-black"
                          controls
                        />
                      ) : (
                        <Image
                          src={URL.createObjectURL(collection?.metadata?.media)}
                          alt="Collection preview"
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                          className="border border-black"
                        />
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <label className="block font-bold mb-1">
                      {dict?.modelOptional}
                    </label>
                    <input
                      type="text"
                      value={collection?.metadata?.model || ""}
                      onChange={(e) =>
                        setCollection({
                          ...collection!,

                          metadata: {
                            ...collection?.metadata!,
                            model: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-black"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">
                      {dict?.aiPromptOptional}
                    </label>
                    <input
                      type="text"
                      value={collection?.metadata?.prompt || ""}
                      onChange={(e) =>
                        setCollection({
                          ...collection!,

                          metadata: {
                            ...collection?.metadata!,
                            prompt: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-black"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">
                      {dict?.workflowOptional}
                    </label>
                    <input
                      type="text"
                      value={collection?.metadata?.workflow || ""}
                      onChange={(e) =>
                        setCollection({
                          ...collection!,

                          metadata: {
                            ...collection?.metadata!,
                            workflow: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2 border border-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedDropId && (
            <div className="mt-6">
              <button
                onClick={() => handleAddCollection(Number(selectedDropId))}
                disabled={
                  addCollectionLoading ||
                  !collection?.metadata?.title ||
                  !collection?.metadata?.description ||
                  !collection?.metadata?.media ||
                  !collection?.amount ||
                  !collection?.price
                }
                className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {addCollectionLoading
                  ? dict?.addingCollection
                  : dict?.addCollection}
              </button>
            </div>
          )}
        </div>
      )}

      {activeSection === "manage" && (
        <div className="space-y-6">
          <div className="border-2 border-black p-6 bg-white">
            <h3 className="text-xl font-bold mb-6">
              {dict?.manageDropsCollections}
            </h3>

            {model?.drops?.map((drop: Drop) => (
              <div
                key={drop?.dropId}
                className="mb-6 border border-gray-300 p-4"
              >
                <div className="flex justify-between flex-wrap items-start mb-4 gap-4">
                  <div>
                    <h4 className="text-lg font-bold">
                      {drop?.metadata?.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {drop?.metadata?.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {dict?.collections}: {drop?.collections?.length}
                    </p>
                  </div>
                  {drop?.dropId !== "orphan" && (
                    <button
                      onClick={() => handleDeleteDrop(Number(drop?.dropId))}
                      disabled={deleteDropLoading === Number(drop?.dropId)}
                      className="bg-red-600 text-white px-3 py-1 text-sm hover:bg-red-700 break-all whitespace-nowrap transition-colors disabled:opacity-50"
                    >
                      {deleteDropLoading === Number(drop?.dropId)
                        ? dict?.deleting
                        : dict?.deleteDrop}
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {drop?.collections?.map((collection: Collection) => {
                    const canDelete =
                      (collection?.tokenIds ?? [])?.length === 0;
                    return (
                      <div
                        key={collection?.collectionId}
                        className="border p-3 bg-gray-50"
                      >
                        <div className="relative flex w-full h-32 mb-2">
                          {collection?.metadata?.mediaType === "mp4" ? (
                            <video
                              autoPlay
                              loop
                              muted
                              className="w-full h-full object-cover border border-black"
                            >
                              <source
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  collection?.metadata?.media?.split(
                                    "ipfs://"
                                  )?.[1]
                                }`}
                                type="video/mp4"
                              />
                            </video>
                          ) : (
                            <Image
                              draggable={false}
                              src={`${INFURA_GATEWAY}/ipfs/${
                                collection?.metadata?.media?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                              alt={collection?.metadata?.title}
                              layout="fill"
                              objectFit="cover"
                              className="border border-black"
                            />
                          )}
                        </div>
                        <h5 className="font-bold text-sm">
                          {collection?.metadata?.title}
                        </h5>
                        <p className="text-xs text-gray-600 mb-2">
                          {Number(collection?.price) / 10 ** 18} MONA • Edition{" "}
                          {collection?.edition ?? 0}
                        </p>
                        <p className="text-xs mb-3">
                          {dict?.sold}: {collection?.tokenIds?.length ?? 0}/
                          {collection?.edition}
                        </p>

                        <div className="space-y-2">
                          <div className="flex gap-2 relative flex-wrap">
                            <div
                              ref={
                                reassignDropdownOpen ===
                                Number(collection?.collectionId)
                                  ? reassignDropdownRef
                                  : null
                              }
                              className="relative flex-1"
                            >
                              <button
                                onClick={() =>
                                  setReassignDropdownOpen(
                                    reassignDropdownOpen ===
                                      Number(collection?.collectionId)
                                      ? null
                                      : Number(collection?.collectionId)
                                  )
                                }
                                className="relative w-full flex flex-row items-center justify-between gap-2 bg-white text-black px-2 py-1 border border-black text-xs hover:bg-gray-100 transition-colors"
                              >
                                <span className="relative w-fit h-fit flex truncate">
                                  {reassignData?.collectionId ===
                                    Number(collection?.collectionId) &&
                                  reassignData?.newDropId
                                    ? model?.drops?.find(
                                        (d: Drop) =>
                                          Number(d.dropId) ===
                                          reassignData?.newDropId
                                      )?.metadata?.title
                                    : dict?.moveTo}
                                </span>
                                <svg
                                  className={`relative w-3 h-3 transition-transform duration-200 flex-shrink-0 ${
                                    reassignDropdownOpen ===
                                    Number(collection?.collectionId)
                                      ? "rotate-180"
                                      : ""
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
                              {reassignDropdownOpen ===
                                Number(collection?.collectionId) && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-black shadow-lg z-50 max-h-40 overflow-y-auto">
                                  <div
                                    onClick={() => {
                                      setReassignData({
                                        collectionId: Number(
                                          collection?.collectionId
                                        ),
                                        newDropId: null,
                                      });
                                      setReassignDropdownOpen(null);
                                    }}
                                    className="relative w-full h-fit flex px-2 py-1 text-xs hover:bg-pink-600 hover:text-white cursor-pointer transition-colors border-b border-gray-200"
                                  >
                                    {dict?.moveTo}
                                  </div>
                                  {model?.drops
                                    ?.filter((d) => d?.dropId !== drop?.dropId)
                                    .map((d: Drop) => (
                                      <div
                                        key={d.dropId}
                                        onClick={() => {
                                          setReassignData({
                                            collectionId: Number(
                                              collection?.collectionId
                                            ),
                                            newDropId: Number(d.dropId),
                                          });
                                          setReassignDropdownOpen(null);
                                        }}
                                        className="relative w-full h-fit flex px-2 py-1 text-xs hover:bg-pink-600 hover:text-white cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                                      >
                                        {d?.metadata?.title}
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                if (reassignData?.newDropId) {
                                  handleReassignCollection(
                                    Number(collection?.collectionId),
                                    reassignData?.newDropId
                                  );
                                }
                              }}
                              disabled={
                                reassignLoading ||
                                reassignData?.collectionId !==
                                  Number(collection?.collectionId) ||
                                !reassignData?.newDropId
                              }
                              className="bg-blue-600 text-white px-2 py-1 text-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                              {dict?.move}
                            </button>
                          </div>

                          {canDelete && (
                            <button
                              onClick={() => handleDeleteCollection(collection)}
                              disabled={
                                deleteCollectionLoading ===
                                Number(collection?.collectionId)
                              }
                              className="w-full bg-red-600 text-white px-2 py-1 text-xs hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              {deleteCollectionLoading ===
                              Number(collection?.collectionId)
                                ? dict?.deleting
                                : dict?.delete}
                            </button>
                          )}

                          {!canDelete && (
                            <div className="text-xs text-gray-500 text-center p-1">
                              {dict?.cannotDelete}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {model?.drops?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-lg mb-2">{dict?.noDropsYet}</div>
                <div className="text-sm">{dict?.createFirstDrop}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTab;
