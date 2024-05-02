import { PokemonData } from "@/contexts/pokemon";
import { QueriesDataCreateProps } from "@/contexts/queries";
import { useQuery } from "@/hooks/useQuery";
import { mapPokemon } from "@/utils/pokemon-mapper";

export const usePokemonList = (
  config?: Omit<QueriesDataCreateProps<PokemonData[]>, "key" | "get">
) => {
  return useQuery({
    ...config,
    key: "pokemon-list",
    get: () => {
      const pokemonListPromises: Promise<PokemonData>[] = [];

      for (let i = 1; i <= 50; i++) {
        pokemonListPromises.push(
          fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
            .then((res) => res.json())
            .then(mapPokemon)
        );
      }

      return Promise.all(pokemonListPromises);
    },
  });
};
