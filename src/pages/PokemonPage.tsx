import { useQuery } from "@/hooks/useQuery";
import { mapPokemon } from "@/utils/pokemon-mapper";
import { Link, LoaderFunctionArgs, useLoaderData } from "react-router-dom";

export async function loader({ params }: LoaderFunctionArgs) {
  const { pokemonId } = params;
  const getPokemon = () =>
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then((res): any => {
      if (!res.ok) {
        return { error: true, pokemon: null };
      }
      return res.json().then((pokemon) => ({
        error: false,
        pokemon: mapPokemon(pokemon),
      }));
    });

  return {
    pokemonId,
    getPokemon,
  };
}

export function PokemonPage() {
  const { pokemonId, getPokemon } = useLoaderData() as any;

  const { data } = useQuery({
    key: `pokemon-${pokemonId}`,
    get: getPokemon,
  });

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
