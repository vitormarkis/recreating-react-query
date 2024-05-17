import React, { createContext, useContext, useRef } from "react"

export type QueriesDataCreateProps<T> = {
  key: string
  get(): Promise<T>
  onSuccess?(data: T): void
  onError?(error: Error): void
  onInitiateQuery?(): void
  onPromiseStateChange?(state: "pending" | "rejected" | "fulfilled"): void
  enabled?: boolean
  fallbackData?: T
}

type Queries = {
  getQuery<T = any>(key: string): T | null
  create<T>({ key, get }: QueriesDataCreateProps<T>): void
}

type Query<T> = {
  data: T | null
  promise: Promise<T> | null
}

export const QueriesContext = createContext<null | Queries>(null)

export const QueriesProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const values = useRef<Record<string, Query<any>>>({})

  Object.assign(window, { __getQueryData: values.current })

  const value: Queries = {
    getQuery(key) {
      const query = values.current[key]
      return query?.data ?? undefined
    },
    create({ key, get, ...cb }) {
      let query = values.current[key]
      if (query?.data) return cb.onSuccess?.(query.data)

      if (!query) {
        values.current[key] = {
          data: undefined,
          promise: null,
        }
      }

      query = values.current[key]

      if (query && !query.promise) {
        cb.onPromiseStateChange?.("pending")
        values.current[key].promise = get()
      }

      const promise = values.current[key].promise!

      cb.onInitiateQuery?.()
      promise
        .then(data => {
          cb.onPromiseStateChange?.("fulfilled")
          cb.onSuccess?.(data)
          values.current[key] = {
            data,
            promise: null,
          }
        })
        .catch(error => {
          cb.onError?.(error as Error)
          cb.onPromiseStateChange?.("rejected")
        })
      return values.current
    },
  }

  return (
    <QueriesContext.Provider value={value}>{children}</QueriesContext.Provider>
  )
}

export const useQueries = () => {
  const queries = useContext(QueriesContext)
  if (!queries) throw new Error("OOC")
  return queries
}
