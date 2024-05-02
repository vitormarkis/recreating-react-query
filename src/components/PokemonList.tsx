import { PokemonDialog } from "@/components/PokemonDialog";
import { PokemonProvider } from "@/contexts/pokemon";
import { usePokemonList } from "@/hooks/usePokemonList";

export function PokemonList() {
  const { data: pokemonList } = usePokemonList();

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
