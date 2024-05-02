import React, { createContext, useContext, useRef } from "react";

export type QueriesDataCreateProps<T> = {
  key: string;
  get(): Promise<T>;
  onSuccess?(data: T): void;
};

type Queries = {
  getQuery<T>(key: string): T | null;
  create<T>({ key, get }: QueriesDataCreateProps<T>): void;
};

export const QueriesContext = createContext<null | Queries>(null);

export const QueriesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const values = useRef(new Map());

  const value: Queries = {
    getQuery(key) {
      const query = values.current.get(key);
      return query ?? null;
    },
    create({ key, get, onSuccess }) {
      const query = values.current.get(key);
      if (query) return onSuccess?.(query);
      get().then((res) => {
        values.current.set(key, res);
        onSuccess?.(res);
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
