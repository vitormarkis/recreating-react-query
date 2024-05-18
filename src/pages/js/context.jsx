import { createContext, useContext } from "react"

export const QueryContext = createContext()

export function QueryProvider({ children, query }) {
  return <QueryContext.Provider value={query}>{children}</QueryContext.Provider>
}

export function useQuery() {
  const query = useContext(QueryContext)
  if (!query) throw new Error("OOC")
  return query
}
