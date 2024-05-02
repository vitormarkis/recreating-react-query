import { PokemonDialog } from "@/components/PokemonDialog";
import { PokemonData, PokemonProvider } from "@/contexts/pokemon";
import { useQuery } from "@/hooks/useQuery";
import { mapPokemon } from "@/utils/pokemon-mapper";

export function PokemonList() {
  const { data: pokemonList } = useQuery({
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

  return (
    <>
      <h2>Pokemon List</h2>
      <div className="flex flex-wrap gap-4">
        {pokemonList
          ? pokemonList.map((pokemon) => (
              <PokemonProvider key={pokemon.name} value={pokemon}>
                <PokemonDialog>
                  <button className="flex flex-col gap-2">
                    <img className="size-20" src={pokemon.image} />
                    <p>{pokemon.name}</p>
                  </button>
                </PokemonDialog>
              </PokemonProvider>
            ))
          : "Loading"}
      </div>
    </>
  );
}
