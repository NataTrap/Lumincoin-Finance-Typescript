import { TokensType } from "../tokens.type"

export type DefaultResponseType = {
    error: boolean,
    message: string
    user?: any
    tokens?: TokensType
    balance?: number
}