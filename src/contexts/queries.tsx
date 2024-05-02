import React, { createContext, useContext, useRef } from "react";

export type QueriesDataCreateProps<T> = {
  key: string;
  get(): Promise<T>;
  onSuccess?(data: T): void;
  onPromiseStateChange?(state: "pending" | "reject" | "fulfilled"): void;
  enabled?: boolean;
  fallbackData?: T
};

type Queries = {
  getQuery<T>(key: string): T | null;
  create<T>({ key, get }: QueriesDataCreateProps<T>): void;
};

type Query<T> = {
  data: T | null;
  promise: Promise<T> | null;
};

export const QueriesContext = createContext<null | Queries>(null);

export const QueriesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const values = useRef<Record<string, Query<any>>>({});

  Object.assign(window, { __getQueryData: values.current });

  const value: Queries = {
    getQuery(key) {
      const query = values.current[key];
      return query?.data ?? undefined;
    },
    create({ key, get, onSuccess, onPromiseStateChange }) {
      let query = values.current[key];
      if (query?.data) return onSuccess?.(query.data);

      if (!query) {
        values.current[key] = {
          data: undefined,
          promise: null,
        };
      }

      query = values.current[key];

      if (query && !query.promise) {
        onPromiseStateChange?.("pending");
        values.current[key].promise = get();
      }

      const promise = values.current[key].promise!;

      promise
        .then((data) => {
          onPromiseStateChange?.("fulfilled");
          values.current[key] = {
            data,
            promise: null,
          };
          onSuccess?.(data);
        })
        .catch(() => {
          onPromiseStateChange?.("reject");
        });
      return values.current;
    },
  };

  return (
    <QueriesContext.Provider value={value}>{children}</QueriesContext.Provider>
  );
};

export const useQueries = () => {
  const queries = useContext(QueriesContext);
  if (!queries) throw new Error("OOC");
  return queries;
};

function promiseState(p: Promise<any>) {
  const t = {};
  return Promise.race([p, t]).then(
    (v) => (v === t ? ("pending" as const) : ("fulfilled" as const)),
    () => "rejected" as const
  );
}
