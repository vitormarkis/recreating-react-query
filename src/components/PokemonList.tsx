import { PokemonDialog } from "@/components/PokemonDialog"
import { usePokemonList } from "@/hooks/usePokemonList"

export function PokemonList() {
  const { data: pokemonList } = usePokemonList()

  return (
    <>
      <h2>Pokemon List</h2>
      <div className="flex flex-wrap gap-4">
        {pokemonList
          ? pokemonList.map(pokemon => (
              <PokemonDialog
                pokemonData={pokemon}
                pokemonId={pokemon.id}
                key={pokemon.id}
              >
                <button className="flex flex-col gap-2">
                  <img
                    className="size-20"
                    src={pokemon.image}
                  />
                  <p>{pokemon.name}</p>
                </button>
              </PokemonDialog>
            ))
          : "Loading"}
      </div>
    </>
  )
}
