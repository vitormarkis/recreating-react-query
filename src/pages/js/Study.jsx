import { useEffect, useReducer, useState } from "react"
import { getPokemon, initQuery } from "./Study.utils"
import { QueryProvider, useQuery } from "./context"

class QueryClient {
  observers = []
  promiseState = "iddle"
  state = initQuery()

  constructor(promise) {
    this.runPromise = promise
    void this.refetch()
  }

  async refetch() {
    if (this.promiseState !== "iddle") return

    try {
      this.promiseState = "pending"
      this.setState({
        data: undefined,
        error: null,
        isLoading: true,
      })
      const data = await this.runPromise()
      this.setState({
        data,
        error: null,
        isLoading: false,
      })
    } catch (error) {
      this.setState({
        data: undefined,
        error: new Error("Something went wrong."),
        isLoading: false,
      })
    } finally {
      this.promiseState = "iddle"
    }
  }

  subscribe(cb) {
    this.observers.push(cb)
    return () => this.observers.splice(this.observers.indexOf(cb), 1)
  }

  setState(state) {
    this.observers.forEach(cb => cb())
    this.state = state
  }
}

export function Study() {
  const [count, increment] = useReducer(old => 1 + old, 0)
  const [pokemonQuery] = useState(() => new QueryClient(getPokemon))

  return (
    <>
      <QueryProvider query={pokemonQuery}>
        <div className="flex gap-2">
          <button
            className="h-9 rounded-md bg-blue-800 px-4 text-sm text-white"
            onClick={() => pokemonQuery.refetch()}
          >
            Refetch
          </button>
          <button
            className="h-9 rounded-md bg-green-800 px-4 text-sm text-white"
            onClick={increment}
          >
            Re-Mount
          </button>
          <PokemonName key={`${count}-name`} />
          <PokemonHeight key={`${count}-height`} />
        </div>
      </QueryProvider>
    </>
  )
}

export function PokemonName({}) {
  const query = useQuery()
  const [, rerender] = useReducer(x => !x, false)
  const { data, error, isLoading } = query.state

  useEffect(() => query.subscribe(rerender), [])

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
        Component id: {Date.now()}
        <br />
        name: {data?.name}
      </p>
    </>
  )
}

export function PokemonHeight({}) {
  const query = useQuery()
  const [, rerender] = useReducer(x => !x, false)
  const { data, error, isLoading } = query.state

  useEffect(() => query.subscribe(rerender), [])

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
        Component id: {Date.now()}
        <br />
        height: {data?.height}
      </p>
    </>
  )
}
