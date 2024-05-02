import { QueriesDataCreateProps } from "@/__query_package__/queries"
import { useQuery } from "@/__query_package__/useQuery"
import { PokemonData } from "@/contexts/pokemon"
import { mapPokemon } from "@/utils/pokemon-mapper"

export const usePokemonList = (
  config?: Omit<QueriesDataCreateProps<PokemonData[]>, "key" | "get">
) => {
  return useQuery({
    ...config,
    key: "pokemon-list",
    get: () => {
      const pokemonListPromises: Promise<PokemonData>[] = []

      for (let i = 1; i <= 50; i++) {
        pokemonListPromises.push(
          fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
            .then(res => res.json())
            .then(mapPokemon)
        )
      }

      return Promise.all(pokemonListPromises)
    },
  })
}
