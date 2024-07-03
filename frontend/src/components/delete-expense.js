import {HttpUtils} from "../utils/http-utils";

export class DeleteExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search); //находим нужный id
        const id = urlParams.get('id');

        if (!id) {
            return this.openNewRoute('/');
        }
        this.deleteCategory(id).then();
    }

    async deleteCategory(id) { //удаляем операцию
        const result = await HttpUtils.request('/categories/expense/' + id, 'DELETE', true);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message);
            return alert('Возникла ошибка при удалении категории');
        }
        return this.openNewRoute('/expense');
    }
}