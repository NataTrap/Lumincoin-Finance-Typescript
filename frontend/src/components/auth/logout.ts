import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
import { OpenNewRoute } from "../../types/route.type";
import { DefaultErrorResponseType } from "../../types/default-error-response.type";


export class Logout {
    private openNewRoute: OpenNewRoute
    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute

        if (!localStorage.getItem('userInfo') || !localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
            this.openNewRoute('/login')
            return
        }

        this.logout().then()
    }


    public async logout (): Promise<void> {
      await HttpUtils.request<DefaultErrorResponseType>('/logout', 'POST', false, {
          refreshToken: localStorage.getItem('refreshToken')
      })
        AuthUtils.removeAuthInfo()

        this.openNewRoute('/login')
    }


}