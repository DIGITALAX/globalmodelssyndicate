import { useContext, useState } from "react";
import {
  usePublicClient,
  useWalletClient,
  useAccount as useAccountWagmi,
} from "wagmi";
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
  const { data: walletClient } = useWalletClient();
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

  const handleRegister = async () => {
    if (
      !address ||
      !walletClient ||
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
      let image = modelData?.image;
      if (typeof modelData?.image !== "string") {
        const formData = new FormData();
        formData.append("file", modelData?.image as File);

        const responseImage = await fetch("/api/ipfs", {
          method: "POST",
          body: formData,
        });

        const resImage = await responseImage.json();
        image = "ipfs://" + resImage.hash;
      }

      let cover = modelData?.cover;
      if (typeof modelData?.cover !== "string") {
        const formData = new FormData();
        formData.append("file", modelData?.cover as File);

        const responseImage = await fetch("/api/ipfs", {
          method: "POST",
          body: formData,
        });

        const resImage = await responseImage.json();
        cover = "ipfs://" + resImage.hash;
      }

      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: modelData.title,
          image,
          cover,
          link: modelData.link,
          description: modelData.description,
        }),
      });

      const result = await response.json();

      const hash = await walletClient.writeContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "registerModel",
        args: ["ipfs://" + result.hash],
        account: address,
      });
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
      !walletClient ||
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
      let image = modelData?.image;
      if (typeof modelData?.image !== "string") {
        const formData = new FormData();
        formData.append("file", modelData?.image as File);

        const responseImage = await fetch("/api/ipfs", {
          method: "POST",
          body: formData,
        });

        const resImage = await responseImage.json();
        image = "ipfs://" + resImage.hash;
      }

      let cover = modelData?.cover;
      if (typeof modelData?.cover !== "string") {
        const formData = new FormData();
        formData.append("file", modelData?.cover as File);

        const responseImage = await fetch("/api/ipfs", {
          method: "POST",
          body: formData,
        });

        const resImage = await responseImage.json();
        cover = "ipfs://" + resImage.hash;
      }

      const response = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: modelData.title,
          image,
          cover,
          link: modelData.link,
          description: modelData.description,
        }),
      });

      const result = await response.json();

      const hash = await walletClient.writeContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "updateModel",
        args: ["ipfs://" + result.hash],
        account: address,
      });
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
      !walletClient ||
      !publicClient ||
      !model ||
      !verified ||
      !modelData?.transferWallet
    )
      return;

    setTransferLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "transferModel",
        args: [modelData?.transferWallet],
        account: address,
      });
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
      !walletClient ||
      !publicClient ||
      !model ||
      !verified ||
      Number(model?.totalSales) > 0
    )
      return;
    setDeleteLoading(true);
    try {
      const hash = await walletClient.writeContract({
        address: contracts.models,
        abi: ABIS.GMSModels,
        functionName: "deleteModel",
        args: [],
        account: address,
      });
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
