import { createContext, useContext } from "react";

export type PokemonData = {
  id: string;
  name: string;
  image: string;
  moves: string[];
};

export const PokemonContext = createContext<null | PokemonData>(null);

export const PokemonProvider: React.FC<
  React.ComponentProps<typeof PokemonContext.Provider>
> = (props) => <PokemonContext.Provider {...props} />;

export const usePokemon = () => {
  const pokemon = useContext(PokemonContext);
  if (!pokemon) throw new Error("OOC");
  return pokemon;
};
