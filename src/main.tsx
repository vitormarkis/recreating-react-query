import App from "@/App"
import { QueriesProvider } from "@/__query_package__/queries"
import { PokemonPage, loader as pokemonPageLoader } from "@/pages/PokemonPage"
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "pokemons/:pokemonId",
    element: <PokemonPage />,
    loader: pokemonPageLoader,
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueriesProvider>
      <RouterProvider router={router} />
    </QueriesProvider>
  </React.StrictMode>
)
