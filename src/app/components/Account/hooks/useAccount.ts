import { useContext, useState } from "react";
import { usePublicClient, useAccount as useAccountWagmi } from "wagmi";
import { isAddress } from "viem";
import uploadIpfs from "@/app/lib/helpers/uploadIpfs";
import useLensChain from "../../Common/hooks/useLensChain";
import { ModelData } from "../types/account.types";
import { ModalContext } from "@/app/providers";
import { getCoreContractAddresses, getCurrentNetwork } from "@/app/lib/constants";
import { Model } from "../../Model/types/model.types";
import { ABIS } from "@/app/abis";

const useAccount = (
  model: Model | undefined,
  verified: boolean,
  dict: any
) => {
  const { address } = useAccountWagmi();
  const publicClient = usePublicClient();
  const context = useContext(ModalContext);
  const { ensureLensWallet } = useLensChain();
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [transferLoading, setTransferLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const network = getCurrentNetwork();
  const contracts = getCoreContractAddresses(network.chainId);
  const [modelData, setModelData] = useState<ModelData>(
    model?.metadata ?? {
      title: "",
      image: "",
      cover: "",
      description: "",
      link: "",
    }
  );

  const uploadProfile = async (): Promise<string> => {
    const image =
      typeof modelData?.image !== "string"
        ? await uploadIpfs(modelData?.image as File)
        : modelData?.image;

    const cover =
      typeof modelData?.cover !== "string"
        ? await uploadIpfs(modelData?.cover as File)
        : modelData?.cover;

    return await uploadIpfs({
      title: modelData.title,
      image,
      cover,
      link: modelData.link,
      description: modelData.description,
    });
  };

  const handleRegister = async () => {
    if (
      !address ||
      !publicClient ||
      model ||
      !verified ||
      modelData?.title?.trim() == "" ||
      !modelData?.image ||
      (typeof modelData?.image == "string" &&
        modelData?.image?.trim() == "") ||
      modelData?.description?.trim() == ""
    )
      return;
    setRegisterLoading(true);
    try {
      const wallet = await ensureLensWallet();
      const uri = await uploadProfile();

      const { request } = await publicClient.simulateContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "registerModel",
        args: [uri],
        account: address,
      });
      const hash = await wallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.registerSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.registerError);
    }
    setRegisterLoading(false);
  };

  const handleUpdate = async () => {
    if (
      !address ||
      !publicClient ||
      !model ||
      !verified ||
      modelData?.title?.trim() == "" ||
      !modelData?.image ||
      (typeof modelData?.image == "string" &&
        modelData?.image?.trim() == "") ||
      modelData?.description?.trim() == ""
    )
      return;
    setUpdateLoading(true);
    try {
      const wallet = await ensureLensWallet();
      const uri = await uploadProfile();

      const { request } = await publicClient.simulateContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "updateModel",
        args: [uri],
        account: address,
      });
      const hash = await wallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.updateSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.updateError);
    }
    setUpdateLoading(false);
  };

  const transferWallet = async () => {
    if (
      !address ||
      !publicClient ||
      !model ||
      !verified ||
      !modelData?.transferWallet
    )
      return;

    setTransferLoading(true);
    try {
      const newWallet = (modelData?.transferWallet ?? "").trim();
      if (!isAddress(newWallet)) {
        throw new Error("Invalid wallet address");
      }

      const wallet = await ensureLensWallet();
      const { request } = await publicClient.simulateContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "transferModel",
        args: [newWallet],
        account: address,
      });
      const hash = await wallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.transferWallet, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.transferError);
    }
    setTransferLoading(false);
  };

  const handleDelete = async () => {
    if (
      !address ||
      !publicClient ||
      !model ||
      !verified ||
      Number(model?.totalSales) > 0
    )
      return;
    setDeleteLoading(true);
    try {
      const wallet = await ensureLensWallet();
      const { request } = await publicClient.simulateContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "deleteModel",
        args: [],
        account: address,
      });
      const hash = await wallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      context?.showSuccess(dict?.deleteSuccess, hash);
    } catch (err: any) {
      console.error(err.message);
      context?.showError(dict?.deleteError);
    }
    setDeleteLoading(false);
  };

  return {
    handleDelete,
    handleRegister,
    handleUpdate,
    registerLoading,
    updateLoading,
    deleteLoading,
    modelData,
    setModelData,
    transferWallet,
    transferLoading,
  };
};

export default useAccount;
