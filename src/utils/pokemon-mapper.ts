import { PokemonData } from "@/contexts/pokemon";

export function mapPokemon(data: Record<string, any>): PokemonData {
  return {
    name: data.name,
    image: data.sprites.other.dream_world.front_default,
    id: data.id,
    moves: data.moves.map(({ move }: any) => move.name),
  };
}
