import {TokensType} from "./tokens.type";

export type AuthInfoType = TokensType & {
    userInfo: string | null;
}