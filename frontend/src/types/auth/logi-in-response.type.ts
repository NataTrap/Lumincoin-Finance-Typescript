import { TokensType } from "../tokens.type"

export type LoginResponseType = {
    tokens: TokensType
    user: {
        name: string
        lastName: string
        id: number
    },
}