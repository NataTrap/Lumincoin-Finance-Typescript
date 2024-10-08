import { DefaultErrorResponseType } from "../../types/default-error-response.type";
import { HttpUtilsResultType } from "../../types/http-utils/httpUtils.type";
import { OpenNewRoute } from "../../types/route.type";
import {HttpUtils} from "../../utils/http-utils";

export class DeleteIncomeExpense {
    private openNewRoute: OpenNewRoute
    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search); //находим нужный id
        const id: string | null = urlParams.get('id');
        if(!id){
            this.openNewRoute('/');
            return 
        }
        this.deleteOperation(id).then();
    }

    private async deleteOperation(id: string): Promise<void>{ //удаляем операцию
        const result: HttpUtilsResultType<DefaultErrorResponseType> = await HttpUtils.request('/operations/' + id, 'DELETE', true);
        if(result.redirect){
            return this.openNewRoute(result.redirect);
        }
        const response: DefaultErrorResponseType | null = result.response;
        if (result.error || !response || (response && response.error)) {
            console.log((response as DefaultErrorResponseType).message);
            return alert('Возникла ошибка при удалении операции');
        }
        return this.openNewRoute('/income-expenses');
    }
}