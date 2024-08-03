import { DefaultResponseType } from "./default-response.type";

export type HttpUtilsResultType<T> = { //<T>  определяет тип данных для response.
    error?: boolean,
    response: T | DefaultResponseType |null,
    redirect?: string,
}