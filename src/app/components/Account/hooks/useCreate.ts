import { useContext, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ModalContext } from "@/app/providers";
import { Collection, Model } from "../../Model/types/model.types";
import { getCoreContractAddresses, getCurrentNetwork } from "@/app/lib/constants";
import { ABIS } from "@/app/abis";

const useCreate = (model: Model | undefined, dict: any) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const context = useContext(ModalContext);
  const { data: walletClient } = useWalletClient();
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [createDropLoading, setCreateDropLoading] = useState<boolean>(false);
  const [addCollectionLoading, setAddCollectionLoading] =
    useState<boolean>(false);
  const [deleteCollectionLoading, setDeleteCollectionLoading] =
    useState<number | null>(null);
  const [deleteDropLoading, setDeleteDropLoading] = useState<number | null>(null);
  const [reassignLoading, setReassignLoading] = useState<boolean>(false);
  const [collection, setCollection] = useState<{
    amount: number;
    price: number;
    metadata: {
      title: string;
      description: string;
      media: File;
      model: string;
      prompt: string;
      workflow: string;
    };
  }>();
  const [collections, setCollections] = useState<
    {
      amount: number;
      price: number;
      metadata: {
        title: string;
        description: string;
        media: File;
        model: string;
        prompt: string;
        workflow: string;
      };
    }[]
  >([]);
  const [drop, setDrop] = useState<{
    title: string;
    description: string;
    image: File;
  }>();

  const handleCreateDrop = async () => {
    if (
      !walletClient ||
      !address ||
      !model ||
      !publicClient ||
      !drop ||
      drop.title.trim() == "" ||
      drop.description.trim() == "" ||
      !drop.image
    )
      return;

    setCreateDropLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", drop.image as File);

      const responseImage = await fetch("/api/ipfs", {
        method: "POST",
        body: formData,
      });

      const resImage = await responseImage.json();

      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: drop.title,
          description: drop.description,
          image: "ipfs://" + resImage.hash,
        }),
      });

      const result = await response.json();

      let promisedCollections: {
        edition: number;
        price: number;
        uri: string;
      }[] = [];

      if (collections.length > 0) {
        promisedCollections = await Promise.all(
          collections
            ?.filter(
              (col) =>
                col.amount > 0 &&
                col.price > 0 &&
                col.metadata.title.trim() !== "" &&
                col.metadata.description.trim() !== "" &&
                col.metadata.media
            )
            ?.map(async (col) => {
              const formData = new FormData();
              formData.append("file", col.metadata.media as File);

              const responseImage = await fetch("/api/ipfs", {
                method: "POST",
                body: formData,
              });

              const resImage = await responseImage.json();

              const response = await fetch("/api/ipfs", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: col.metadata.title,
                  description: col.metadata.description,
                  mediaType: col.metadata.media.type,
                  media: "ipfs://" + resImage.hash,
                  model: col.metadata.model,
                  prompt: col.metadata.prompt,
                  workflow: col.metadata.workflow,
                }),
              });

              const result = await response.json();

              return {
                edition: col.amount,
                price: col.price * 10 ** 18,
                uri: "ipfs://" + result.hash,
              };
            })
        );
      }

      const hash = await walletClient.writeContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "createDrop",
        args: ["ipfs://" + result.hash, promisedCollections],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.createDropSuccess, hash);
      setDrop(undefined);
      setCollections([]);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.createDropError);
    }
    setCreateDropLoading(false);
  };

  const handleAddCollection = async (dropId: number) => {
    if (
      !walletClient ||
      !address ||
      !model ||
      !publicClient ||
      !collection ||
      collection.metadata.title.trim() == "" ||
      collection.metadata.description.trim() == "" ||
      !collection.metadata.media
    )
      return;

    setAddCollectionLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", collection.metadata.media as File);

      const responseImage = await fetch("/api/ipfs", {
        method: "POST",
        body: formData,
      });

      const resImage = await responseImage.json();

      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: collection.metadata.title,
          description: collection.metadata.description,
          mediaType: collection.metadata.media.type,
          media: "ipfs://" + resImage.hash,
          model: collection.metadata.model,
          prompt: collection.metadata.prompt,
          workflow: collection.metadata.workflow,
        }),
      });

      const result = await response.json();

      const hash = await walletClient.writeContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "addCollection",
        args: [
          dropId,
          {
            edition: collection.amount,
            price: collection.price * 10 ** 18,
            uri: "ipfs://" + result.hash,
          },
        ],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.addCollectionSuccess, hash);
      setCollection(undefined)
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.addCollectionError);
    }
    setAddCollectionLoading(false);
  };

  const handleDeleteCollection = async (collection: Collection) => {
    if (
      !walletClient ||
      !address ||
      !model ||
      !publicClient ||
      Number(collection?.tokenIds?.length) > 0
    )
      return;

    const collectionId = Number(collection.collectionId);
    setDeleteCollectionLoading(collectionId);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "deleteCollection",
        args: [collectionId],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.deleteCollectionSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.deleteCollectionError);
    }
    setDeleteCollectionLoading(null);
  };

  const handleDeleteDrop = async (dropId: number) => {
    if (!walletClient || !address || !model || !publicClient) return;
    setDeleteDropLoading(dropId);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "deleteDrop",
        args: [dropId],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.deleteDropSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.deleteDropError);
    }
    setDeleteDropLoading(null);
  };

  const handleReassignCollection = async (
    collectionId: number,
    newDropId: number
  ) => {
    if (!walletClient || !address || !model || !publicClient) return;
    setReassignLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "reassignCollection",
        args: [collectionId, newDropId],
        account: address,
      });
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.reassignCollectionSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.reassignCollectionError);
    }
    setReassignLoading(false);
  };

  return {
    createDropLoading,
    handleCreateDrop,
    handleAddCollection,
    handleDeleteCollection,
    handleDeleteDrop,
    handleReassignCollection,
    addCollectionLoading,
    deleteCollectionLoading,
    deleteDropLoading,
    reassignLoading,
    collections,
    setCollections,
    drop,
    setDrop,
    collection,
    setCollection,
  };
};

export default useCreate;
