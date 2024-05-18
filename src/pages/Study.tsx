import { useEffect, useReducer, useRef, useState } from "react"
import { IQuery, User, getUser, initQuery } from "./Study.utils"

class Query<TData> {
  data: IQuery<TData>
  observers: Function[] = []
  promise: () => Promise<TData>

  constructor(promise: () => Promise<TData>) {
    this.data = initQuery()
    this.promise = promise
    void this.fetch()
  }

  async fetch() {
    try {
      this.setData({
        data: undefined,
        error: null,
        isLoading: true,
      })
      const data = await this.promise()
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

  subscribe(cb: Function) {
    this.observers.push(cb)
  }

  setData(data: IQuery<TData>) {
    this.observers.forEach(cb => cb())
    this.data = data
  }
}

export function Study() {
  const [query] = useState(() => new Query(getUser))
  const queryRef = useRef(query)

  return (
    <>
      <div className="flex gap-2">
        <button
          className="h-9 rounded-md bg-blue-800 px-4 text-sm text-white"
          onClick={() => queryRef.current.fetch()}
        >
          Refetch
        </button>
        <GetData queryRef={queryRef} />
      </div>
    </>
  )
}

type GetDataProps = {
  queryRef: React.MutableRefObject<Query<User>>
}

export function GetData({ queryRef }: GetDataProps) {
  const [, rerender] = useReducer(x => !x, false)
  const { data, error, isLoading } = queryRef.current.data

  useEffect(() => {
    queryRef.current.subscribe(rerender)
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
    return (
      <div className="flex gap-2">
        <strong className="text-red-500">{error.message}</strong>
      </div>
    )
  }

  return (
    <>
      <p className="bg-green-200 px-2 py-1 text-lg/none text-green-600">
        {data?.name}
      </p>
    </>
  )
}
