import { DefaultResponseType } from "./http-utils/default-response.type"

export type GetCategoryType = {
    id: number
    title: string
    response?: any
    error?: boolean
    redirect?: string
}