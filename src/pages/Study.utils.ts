export type User = {
  name: string
}

export async function getUser(): Promise<User> {
  const response = await fetch("https://api.github.com/users/vitormarkis")
  return response.json()
}

export function initQuery<TData>(): IQuery<TData> {
  return {
    data: undefined,
    error: null,
    isLoading: false,
  }
}

export type IQuery<TData> =
  | {
      data: TData
      error: null
      isLoading: false
    }
  | {
      data: undefined
      error: Error
      isLoading: false
    }
  | {
      data: undefined
      error: null
      isLoading: boolean
    }

export const getRandomNumber = async () =>
  new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random()
      if (random > 0.7) return reject(new Error("Wrong."))
      return resolve(random * 100)
    })
  })
