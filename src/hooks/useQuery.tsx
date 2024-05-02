import { QueriesDataCreateProps, useQueries } from "@/contexts/queries";
import { useEffect, useState } from "react";

export function useQuery<T>(config: QueriesDataCreateProps<T>) {
  const queries = useQueries();
  const [data, setData] = useState<null | T>(queries.getQuery(config.key));

  useEffect(() => {
    queries.create<T>({
      ...config,
      onPromiseStateChange(state) {
        switch (state) {
          case "fulfilled":
            break;
          case "pending":
            setData(null);
            break;
          case "reject":
            setData(null);
            break;
        }
      },
      onSuccess(resData) {
        setData(resData);
        config.onSuccess?.(resData);
      },
    });
  }, [config]);
  return { data };
}
