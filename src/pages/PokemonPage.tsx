import { mapPokemon } from "@/utils/pokemon-mapper";
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router-dom";

export async function loader({ params }: LoaderFunctionArgs) {
  const { pokemonId } = params;
  const pokemonFetch = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  );
  if (!pokemonFetch.ok) {
    return { error: true, pokemon: null };
  }
  const pokemon = await pokemonFetch.json();
  return { error: false, pokemon: mapPokemon(pokemon) };
}

export function PokemonPage() {
  const data = useLoaderData();

  return (
    <>
      <Link
        to=".."
        className="h-9 px-4 w-fit flex items-center bg-blue-500 hover:bg-blue-600 transition-all duration-300 justify-center"
      >
        Voltar
      </Link>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
