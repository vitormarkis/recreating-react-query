import { useQuery } from "@/__query_package__/useQuery"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PokemonData } from "@/contexts/pokemon"

import { cn } from "@/lib/utils"
import { getPokemon } from "@/pages/PokemonPage"
import React, { useState } from "react"
import { Link } from "react-router-dom"

export type PokemonDialogProps = React.ComponentPropsWithoutRef<
  typeof DialogContent
> & {
  pokemonId: string
  pokemonData?: PokemonData
}

export const PokemonDialog = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  PokemonDialogProps
>(function PokemonDialogComponent(
  { pokemonData, pokemonId, children, className, ...props },
  ref
) {
  const [isOpen, setIsOpen] = useState(false)

  const { data: pokemon } = useQuery({
    key: `pokemon-${pokemonId}`,
    get: () => getPokemon(pokemonId),
    enabled: isOpen,
    fallbackData: pokemonData,
  })

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        ref={ref}
        className={cn("flex", className)}
        {...props}
      >
        {pokemon ? (
          <>
            <DialogHeader className="mr-3 flex-1 border-r pr-3">
              <DialogTitle>{pokemon.name}</DialogTitle>
              <h3 className="ml-2 font-semibold">Moves</h3>
              <ScrollArea className="h-[24rem] rounded-md p-4">
                <div className="flex flex-wrap gap-2">
                  {pokemon.moves.map(move => (
                    <span
                      key={move}
                      className="rounded bg-neutral-200 px-1 py-0.5 text-sm/none text-neutral-800"
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
                  className="flex h-9 w-full items-center justify-center bg-neutral-200 transition-all duration-300 hover:bg-neutral-300"
                >
                  Ver mais
                </Link>
              </div>
            </main>
          </>
        ) : (
          "loading pokemon data"
        )}
      </DialogContent>
    </Dialog>
  )
})
