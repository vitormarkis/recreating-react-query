import { useEffect, useReducer, useState, useSyncExternalStore } from "react"
import { QueryProvider, useQuery } from "./context"

function getPokemon() {
  return async function ({ signal }) {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/1", {
      signal,
    })
    if (Math.random() > 0.7) throw new Error("Expected error.")
    return response.json()
  }
}

class QueryClient {
  abortController = new AbortController()
  observers = new Set()
  state = {
    data: undefined,
    error: null,
    isLoading: false,
  }

  constructor(runPromise) {
    this.runPromise = runPromise()
    void this.refetch()
  }

  getState() {
    return this.state
  }

  async refetch() {
    this.abortController.abort()
    this.abortController = new AbortController()
    try {
      this.setState({
        data: undefined,
        error: null,
        isLoading: true,
      })
      const data = await this.runPromise({
        signal: this.abortController.signal,
      })
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
    }
  }

  subscribe(cb) {
    this.observers.add(cb)
    return () => this.observers.delete(cb)
  }

  setState(state) {
    this.state = state
    this.observers.forEach(cb => cb())
  }
}

export function Study() {
  const [pokemonQuery] = useState(() => new QueryClient(getPokemon))
  const [count, increment] = useReducer(old => 1 + old, 0)

  useEffect(() => {
    Object.assign(window, { pokemonQuery })
  }, [])

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
          <PokemonName key={`${count}-name`}>
            <InnerName />
          </PokemonName>
          <PokemonHeight key={`${count}-height`} />
        </div>
      </QueryProvider>
    </>
  )
}

export function PokemonName({ children }) {
  const query = useQuery()

  const { data, error, isLoading } = useSyncExternalStore(
    query.subscribe.bind(query),
    query.getState.bind(query)
  )

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
      {children}
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

function InnerName() {
  return <RefetchButton>Deep Refetch</RefetchButton>
}

function RefetchButton({ children }) {
  const query = useQuery()

  return <button onClick={query.refetch.bind(query)}>{children}</button>
}
