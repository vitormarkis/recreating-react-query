import { useEffect, useReducer, useRef, useState } from "react"
import { getUser, initQuery } from "./Study.utils"

class QueryClient {
  observers = []

  constructor(promise) {
    this.data = initQuery()
    this.runPromise = promise
    void this.refetch()
  }

  async refetch() {
    try {
      this.setData({
        data: undefined,
        error: null,
        isLoading: true,
      })
      const data = await this.runPromise()
      this.setData({
        data,
        error: null,
        isLoading: false,
      })
    } catch (error) {
      this.setData({
        data: undefined,
        error: new Error("Something went wrong."),
        isLoading: false,
      })
    }
  }

  subscribe(cb) {
    this.observers.push(cb)
  }

  setData(data) {
    this.observers.forEach(cb => cb())
    this.data = data
  }
}

export function Study() {
  const [userQueryClient] = useState(() => new QueryClient(getUser))
  const userQueryRef = useRef(userQueryClient)

  return (
    <>
      <div className="flex gap-2">
        <button
          className="h-9 rounded-md bg-blue-800 px-4 text-sm text-white"
          onClick={() => userQueryRef.current.refetch()}
        >
          Refetch
        </button>
        <GetData userQueryRef={userQueryRef} />
      </div>
    </>
  )
}

export function GetData({ userQueryRef }) {
  const [, rerender] = useReducer(x => !x, false)
  const { data, error, isLoading } = userQueryRef.current.data

  useEffect(() => {
    userQueryRef.current.subscribe(rerender)
  }, [])

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <strong>Loading...</strong>
        <div className="size-6 animate-pulse bg-neutral-300" />
      </div>
    )
  }

  if (error) {
    return <strong className="text-red-500">{error.message}</strong>
  }

  return (
    <>
      <p className="bg-green-200 px-2 py-1 text-lg/none text-green-600">
        {data?.name}
      </p>
    </>
  )
}
