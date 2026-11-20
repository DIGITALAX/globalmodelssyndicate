import { useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { parseUnits } from "viem";
import { ModalContext } from "@/app/providers";
import { Collection, Designer, Model } from "../../Model/types/model.types";
import {
  getCoreContractAddresses,
  getCurrentNetwork,
  MAX_COLLECTION_DESIGNERS,
  MONA_DECIMALS,
} from "@/app/lib/constants";
import { ABIS } from "@/app/abis";
import uploadIpfs from "@/app/lib/helpers/uploadIpfs";
import useLensChain from "../../Common/hooks/useLensChain";
import { getDesignersPaginated } from "../../../../../graphql/gdn/getDesigners";
import {
  CollectionDraft,
  CreateCollectionParams,
  DropDraft,
} from "../types/account.types";

const DESIGNER_ADDRESS_ABI = [
  {
    type: "function",
    name: "getDesignerAddress",
    inputs: [{ name: "designerId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
] as const;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const useCreate = (model: Model | undefined, dict: any) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const context = useContext(ModalContext);
  const { ensureLensWallet } = useLensChain();
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [createDropLoading, setCreateDropLoading] = useState<boolean>(false);
  const [addCollectionLoading, setAddCollectionLoading] =
    useState<boolean>(false);
  const [deleteCollectionLoading, setDeleteCollectionLoading] =
    useState<number | null>(null);
  const [deleteDropLoading, setDeleteDropLoading] = useState<number | null>(null);
  const [reassignLoading, setReassignLoading] = useState<boolean>(false);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [designersLoading, setDesignersLoading] = useState<boolean>(false);
  const [collection, setCollection] = useState<CollectionDraft>();
  const [collections, setCollections] = useState<CollectionDraft[]>([]);
  const [drop, setDrop] = useState<DropDraft>();

  const loadDesigners = async () => {
    setDesignersLoading(true);
    try {
      const all: Designer[] = [];
      let skip = 0;
      while (skip < 1000) {
        const res: any = await getDesignersPaginated(100, skip);
        const page: Designer[] = res?.data?.designers ?? [];
        all.push(...page);
        if (page.length < 100) break;
        skip += 100;
      }
      setDesigners(all);
    } catch (err: any) {
      console.error(err.message);
    }
    setDesignersLoading(false);
  };

  useEffect(() => {
    loadDesigners();
  }, []);

  const validateDraft = async (
    col: CollectionDraft
  ): Promise<Omit<CreateCollectionParams, "uri"> | undefined> => {
    if (!publicClient) return undefined;

    if (!Number.isInteger(col.amount) || col.amount <= 0) {
      context?.showError(dict?.invalidEditionError);
      return undefined;
    }

    const rawPrice = String(col.price ?? "").trim();
    const priceText = rawPrice.startsWith(".") ? `0${rawPrice}` : rawPrice;
    if (!/^\d+(\.\d{1,18})?$/.test(priceText)) {
      context?.showError(dict?.invalidPriceError);
      return undefined;
    }

    const price = parseUnits(priceText, MONA_DECIMALS);
    if (price <= BigInt(0)) {
      context?.showError(dict?.invalidPriceError);
      return undefined;
    }

    const ids = Array.from(
      new Set((col.designerIds ?? []).map((id) => String(id).trim()))
    );

    if (ids.length === 0) {
      context?.showError(dict?.selectDesignerError);
      return undefined;
    }

    if (
      ids.length > MAX_COLLECTION_DESIGNERS ||
      ids.some((id) => !/^\d+$/.test(id) || BigInt(id) <= BigInt(0))
    ) {
      context?.showError(dict?.invalidDesignerError);
      return undefined;
    }

    const designerIds = ids.map((id) => BigInt(id));

    const wallets = await Promise.all(
      designerIds.map((id) =>
        publicClient.readContract({
          address: contracts.designers,
          abi: DESIGNER_ADDRESS_ABI,
          functionName: "getDesignerAddress",
          args: [id],
        })
      )
    );

    if (wallets.some((wallet) => !wallet || wallet === ZERO_ADDRESS)) {
      context?.showError(dict?.invalidDesignerError);
      return undefined;
    }

    return {
      edition: BigInt(col.amount),
      price,
      designerIds,
    };
  };

  const uploadCollection = async (
    col: CollectionDraft,
    validated: Omit<CreateCollectionParams, "uri">
  ): Promise<CreateCollectionParams> => {
    const media = await uploadIpfs(col.metadata.media);
    const uri = await uploadIpfs({
      title: col.metadata.title,
      description: col.metadata.description,
      mediaType: col.metadata.media.type,
      media,
      model: col.metadata.model,
      prompt: col.metadata.prompt,
      workflow: col.metadata.workflow,
    });

    return {
      edition: validated.edition,
      price: validated.price,
      uri,
      designerIds: validated.designerIds,
    };
  };

  const handleCreateDrop = async () => {
    if (
      !address ||
      !model ||
      !publicClient ||
      !drop ||
      !drop.title ||
      drop.title.trim() == "" ||
      !drop.description ||
      drop.description.trim() == "" ||
      !drop.image
    )
      return;

    setCreateDropLoading(true);
    try {
      const drafts = collections.filter(
        (col) =>
          col.amount > 0 &&
          Number(col.price) > 0 &&
          col.metadata.title.trim() !== "" &&
          col.metadata.description.trim() !== "" &&
          col.metadata.media
      );

      const validated: Omit<CreateCollectionParams, "uri">[] = [];
      for (const col of drafts) {
        const result = await validateDraft(col);
        if (!result) {
          setCreateDropLoading(false);
          return;
        }
        validated.push(result);
      }

      const wallet = await ensureLensWallet();

      const image = await uploadIpfs(drop.image);
      const dropUri = await uploadIpfs({
        title: drop.title,
        description: drop.description,
        image,
      });

      const params: CreateCollectionParams[] = await Promise.all(
        drafts.map((col, index) => uploadCollection(col, validated[index]))
      );

      const { request } = await publicClient.simulateContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "createDrop",
        args: [dropUri, params],
        account: address,
      });
      const hash = await wallet.writeContract(request);
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
      !address ||
      !model ||
      !publicClient ||
      !collection ||
      !collection.metadata?.title ||
      collection.metadata.title.trim() == "" ||
      !collection.metadata?.description ||
      collection.metadata.description.trim() == "" ||
      !collection.metadata.media
    )
      return;

    setAddCollectionLoading(true);
    try {
      const validated = await validateDraft(collection);
      if (!validated) {
        setAddCollectionLoading(false);
        return;
      }

      const wallet = await ensureLensWallet();
      const params = await uploadCollection(collection, validated);

      const { request } = await publicClient.simulateContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "addCollection",
        args: [BigInt(dropId), params],
        account: address,
      });
      const hash = await wallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.addCollectionSuccess, hash);
      setCollection(undefined);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.addCollectionError);
    }
    setAddCollectionLoading(false);
  };

  const handleDeleteCollection = async (collection: Collection) => {
    if (
      !address ||
      !model ||
      !publicClient ||
      Number(collection?.tokenIds?.length) > 0
    )
      return;

    const collectionId = Number(collection.collectionId);
    setDeleteCollectionLoading(collectionId);
    try {
      const wallet = await ensureLensWallet();
      const { request } = await publicClient.simulateContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "deleteCollection",
        args: [BigInt(collectionId)],
        account: address,
      });
      const hash = await wallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.deleteCollectionSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.deleteCollectionError);
    }
    setDeleteCollectionLoading(null);
  };

  const handleDeleteDrop = async (dropId: number) => {
    if (!address || !model || !publicClient) return;
    setDeleteDropLoading(dropId);
    try {
      const wallet = await ensureLensWallet();
      const { request } = await publicClient.simulateContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "deleteDrop",
        args: [BigInt(dropId)],
        account: address,
      });
      const hash = await wallet.writeContract(request);
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
    if (!address || !model || !publicClient) return;
    setReassignLoading(true);
    try {
      const wallet = await ensureLensWallet();
      const { request } = await publicClient.simulateContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "reassignCollection",
        args: [BigInt(collectionId), BigInt(newDropId)],
        account: address,
      });
      const hash = await wallet.writeContract(request);
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
    designers,
    designersLoading,
  };
};

export default useCreate;
