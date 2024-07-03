
import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        if (!localStorage.getItem('userInfo') || !localStorage.getItem('accessToken') || !localStorage.getItem('refreshToken')) {
            return this.openNewRoute('/login')
        }

        this.logout().then()
    }


    async logout () {
      await HttpUtils.request('/logout', 'POST', false, {
          refreshToken: localStorage.getItem('refreshToken')
      })
        AuthUtils.removeAuthInfo()

        this.openNewRoute('/login')
    }


}