import { QueriesDataCreateProps, useQueries } from "@/contexts/queries";
import { useEffect, useState } from "react";

export function useQuery<T>(config: QueriesDataCreateProps<T>) {
  const queries = useQueries();
  const queryData = queries.getQuery(config.key) as T;
  const [data, setData] = useState<undefined | T>(queryData);

  config.enabled ??= true;

  useEffect(() => {
    if (!config.enabled) return;

    queries.create<T>({
      ...config,
      onPromiseStateChange(state) {
        switch (state) {
          case "fulfilled":
            break;
          case "pending":
            setData(undefined);
            break;
          case "reject":
            setData(undefined);
            break;
        }
      },
      onSuccess(resData) {
        setData(resData);
        config.onSuccess?.(resData);
      },
    });
  }, [config]);
  return { data: data ?? config.fallbackData };
}
