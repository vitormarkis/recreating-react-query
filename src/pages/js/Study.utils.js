export async function getPokemon() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/1")
  if (Math.random() > 0.7) throw new Error("Expected error.")
  return response.json()
}

export function initQuery() {
  return {
    data: undefined,
    error: null,
    isLoading: false,
  }
}

export const getRandomNumber = async () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random()
      if (random > 0.7) return reject(new Error("Wrong."))
      return resolve(random * 100)
    })
  })
