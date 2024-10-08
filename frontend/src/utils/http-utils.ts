import config from "../config/config";
import {AuthUtils} from "./auth-utils";
import { HttpUtilsResultType } from "../types/http-utils/httpUtils.type";
import { TokensType } from "../types/tokens.type";

export class HttpUtils {

    // public static async request(url: "/balance", method: 'GET', useAuth: true, body: null): Promise<ResultBalanceType>
    public static async request<T>(url: string, method: string = 'GET', useAuth: boolean = true, body: any = null): Promise<HttpUtilsResultType<T>> {
        const result: HttpUtilsResultType<T> = {
            error: false,
            response: null
        }

        let token:  string | TokensType | null = null
        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'x-auth-token': token
            },
        }

        if (useAuth) {
            token= AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                params.headers['x-auth-token'] = token
            }

        }

        if (body) {
            params.body = JSON.stringify(body)
        }

        let response = null

        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json()
        } catch (e){
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true
            if (useAuth && response.status === 401) {
                if (!token) {
                    // 1 Нет токена
                    result.redirect = '/login'
                } else {
                    // 2 Токен устарел
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        // Делаем запрос повторно
                        return this.request(url, method, useAuth, body)
                    } else {
                        result.redirect = '/login'
                    }
                }
            }
        }

        return result

    }
}