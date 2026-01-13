import { useEffect, useState } from "react";
import { ensureMetadata } from "@/app/lib/utils";
import { getModelsPaginated } from "../../../../../graphql/gms/getModels";
import { Model } from "../../Model/types/model.types";

const useModels = () => {
  const [modelsLoading, setModelsLoading] = useState<boolean>(false);
  const [models, setModels] = useState<Model[]>([]);
  const [skip, setSkip] = useState<number>(0);

  const handleModels = async (loadMore: boolean = false) => {
    setModelsLoading(true);
    try {
      const currentSkip = loadMore ? skip : 0;
      const data = await getModelsPaginated(20, currentSkip);
      let models = await Promise.all(
        data?.data?.models?.map(async (des: any) => {
          return await ensureMetadata(des);
        })
      );

      if (loadMore) {
        setModels((prev) => [...prev, ...models]);
      } else {
        setModels(models ?? []);
      }

      if (loadMore) {
        setSkip(currentSkip + 20);
      } else {
        setSkip(20);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setModelsLoading(false);
  };

  const loadMore = () => {
    handleModels(true);
  };

  useEffect(() => {
    if (models.length < 1) {
      handleModels();
    }
  }, []);

  return {
    modelsLoading,
    models,
    loadMore,
  };
};

export default useModels;
