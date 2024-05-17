import { useEffect, useReducer, useState } from "react"
import { QueriesDataCreateProps, useQueries } from "./queries"

type State<TData> = {
  data: TData | undefined
  isLoading: boolean
  error: Error | null
}

type ActionLoading = {
  type: "loading"
}

type ActionGotData<TData> = {
  type: "got_data"
  data: TData
}

type ActionPromiseRejected = {
  type: "error"
  error: Error
}

type StateDispatcher<TData> =
  | ActionLoading
  | ActionGotData<TData>
  | ActionPromiseRejected

function queryStateReducer<TData>(
  prevState: State<TData>,
  dispatcher: StateDispatcher<TData>
): State<TData> {
  switch (dispatcher.type) {
    case "loading":
      prevState.isLoading = true
      prevState.data = undefined
      prevState.error = null
      break
    case "got_data":
      prevState.isLoading = false
      prevState.error = null
      prevState.data = dispatcher.data
      break
    case "error":
      prevState.isLoading = false
      prevState.error = dispatcher.error
      prevState.data = undefined
      break
  }

  return { ...prevState }
}

export function useQuery<TData>(config: QueriesDataCreateProps<TData>) {
  const queries = useQueries()
  const queryData = queries.getQuery<TData>(config.key)
  const [state, dispatch] = useReducer(queryStateReducer, {
    data: queryData,
    isLoading: false,
    error: null,
  })
  config.enabled ??= true

  useEffect(() => {
    if (!config.enabled) return

    queries.create<TData>({
      ...config,
      onError(error) {
        dispatch({ type: "error", error })
        config.onError?.(error)
      },
      onInitiateQuery() {
        dispatch({ type: "loading" })
        config.onInitiateQuery?.()
      },
      onSuccess(data) {
        dispatch({ type: "got_data", data })
        config.onSuccess?.(data)
      },
    })
  }, [config])
  return state
}
