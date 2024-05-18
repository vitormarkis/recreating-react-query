import App from "@/App"
import { QueriesProvider } from "@/__query_package__/queries"
import { PokemonPage, loader as pokemonPageLoader } from "@/pages/PokemonPage"
import ReactDOM from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import "./index.css"
import { Study } from "@/pages/js/Study"
// import { Study } from "@/pages/Study"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/pokemons/:pokemonId",
    element: <PokemonPage />,
    loader: pokemonPageLoader,
  },
  {
    path: "/study",
    element: <Study />,
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueriesProvider>
    <RouterProvider router={router} />
  </QueriesProvider>
)
