import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePokemon } from "@/contexts/pokemon";

import { cn } from "@/lib/utils";
import React from "react";
import { Link } from "react-router-dom";

export type PokemonDialogProps = React.ComponentPropsWithoutRef<
  typeof DialogContent
>;

export const PokemonDialog = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  PokemonDialogProps
>(function PokemonDialogComponent({ children, className, ...props }, ref) {
  const pokemon = usePokemon();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent ref={ref} className={cn("flex", className)} {...props}>
        <DialogHeader className="flex-1 pr-3 border-r mr-3">
          <DialogTitle>{pokemon.name}</DialogTitle>
          <h3 className="ml-2 font-semibold">Moves</h3>
          <ScrollArea className="h-[24rem] rounded-md p-4">
            <div className="flex gap-2 flex-wrap">
              {pokemon.moves.map((move) => (
                <span
                  key={move}
                  className="text-sm/none px-1 py-0.5 rounded bg-neutral-200 text-neutral-800"
                >
                  {move}
                </span>
              ))}
            </div>
          </ScrollArea>
        </DialogHeader>
        <main className="flex-1">
          <img src={pokemon.image} />
          <div className="pt-4">
            <Link
              to={`/pokemons/${pokemon.id}`}
              className="w-full h-9 flex items-center bg-neutral-200 hover:bg-neutral-300 transition-all duration-300 justify-center"
            >
              Ver mais
            </Link>
          </div>
        </main>
      </DialogContent>
    </Dialog>
  );
});
