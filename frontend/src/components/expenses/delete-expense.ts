
import { DefaultErrorResponseType } from "../../types/default-error-response.type";
import { HttpUtilsResultType } from "../../types/http-utils/httpUtils.type";
import { OpenNewRoute } from "../../types/route.type";
import {HttpUtils} from "../../utils/http-utils";

export class DeleteExpense {
    private openNewRoute: OpenNewRoute
    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search); //находим нужный id
        const id: string | null = urlParams.get('id');
        if (!id) {
            this.openNewRoute('/');
            return
        }
        this.deleteCategory(id).then();
    }

    private async deleteCategory(id: string): Promise<void> { //удаляем операцию
        const result: HttpUtilsResultType<DefaultErrorResponseType>  = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при удалении категории');
        }
        return this.openNewRoute('/expense');
    }
}