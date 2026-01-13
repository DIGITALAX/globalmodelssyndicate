import { useEffect, useState } from "react";
import { Collection, Model, Drop } from "../types/model.types";
import { ensureMetadata } from "@/app/lib/utils";
import { getModel } from "../../../../../graphql/gms/getModels";

const useModel = (modelWallet: string | undefined) => {
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [model, setModel] = useState<Model | undefined>();

  const handleModel = async () => {
    if (!modelWallet) return;
    setModelLoading(true);
    try {
      const data = await getModel(modelWallet);
      let foundModel = data?.data?.models?.[0];
      foundModel = await ensureMetadata(data?.data?.models?.[0]);
      if (foundModel) {
        setModel({
          ...foundModel,
          drops: await Promise.all(
            foundModel?.drops?.map(async (drop: Drop) => {
              let data = await ensureMetadata(drop);
              return {
                ...data,
                collections: await Promise.all(
                  foundModel?.collections
                    ?.filter(
                      (col: Collection) => col?.drop?.dropId == drop?.dropId
                    )
                    ?.map(async (col: Collection) => {
                      return await ensureMetadata(col);
                    }) || []
                ),
              };
            })
          ),
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setModelLoading(false);
  };

  useEffect(() => {
    if (modelWallet) {
      handleModel();
    }
  }, [modelWallet]);

  return {
    modelLoading,
    model,
  };
};

export default useModel;
