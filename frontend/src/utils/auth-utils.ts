import config from "../config/config";
import {UserInfoType} from "../types/user-info.type";
import {RefreshResponseType} from "../types/refresh-response.type";
import {AuthInfoType} from "../types/auth-info.tyoe";

export class AuthUtils {
    public static accessTokenKey: string = 'accessToken'
    public static refreshTokenKey: string = 'refreshToken'
    public static userInfoTokenKey: string = 'userInfo'


    public static setAuthInfo (accessToken: string, refreshToken: string, userInfo?: UserInfoType ): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));

    }
   public static removeAuthInfo (): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);

    }

    public static getAuthInfo(): AuthInfoType;
    public static getAuthInfo(key: string): string | null;
    public static getAuthInfo(key?: string): AuthInfoType | string | null {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key)
        } else {
            return {
                accessToken: localStorage.getItem(this.accessTokenKey),
                refreshToken: localStorage.getItem(this.refreshTokenKey),
                userInfo: localStorage.getItem(this.userInfoTokenKey),
            }
        }
    }



    public static async updateRefreshToken (): Promise<boolean> {
        let result: boolean = false
        const refreshToken: AuthInfoType | null = this.getAuthInfo(this.refreshTokenKey) as AuthInfoType | null;
        if (refreshToken) {
            const response: Response = await fetch(config.api + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({refreshToken: refreshToken})
            });

            if (response && response.status === 200) {
                const tokens: RefreshResponseType | null = await response.json()
                if (tokens && !tokens.error && tokens.tokens.accessToken && tokens.tokens.refreshToken) {
                    this.setAuthInfo(tokens.tokens.accessToken, tokens.tokens.refreshToken);
                    result = true
                }
            }
        }

        if (!result) {
            this.removeAuthInfo()
        }

        return result
    }
}