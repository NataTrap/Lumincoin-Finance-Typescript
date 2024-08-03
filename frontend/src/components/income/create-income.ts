import { HttpUtilsResultType } from "../../types/http-utils/httpUtils.type";
import { ResultCreateCategoryType } from "../../types/result.type";
import { OpenNewRoute } from "../../types/route.type";
import {HttpUtils} from "../../utils/http-utils";

export class CreateIncome {
    private openNewRoute: OpenNewRoute
    private inputElement: HTMLInputElement | null
    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        this.inputElement = document.querySelector('input');
        (document.getElementById('create-button') as HTMLElement).addEventListener('click', this.saveCategory.bind(this));
    }

    private validateForm(): boolean{
        let isValid = true;
        if(this.inputElement) {
            if(this.inputElement.value){
                this.inputElement.classList.remove('is-invalid');
            } else {
                this.inputElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }

    private async saveCategory(e: Event): Promise<void>{
        e.preventDefault;
        if(this.validateForm()){
            const result: HttpUtilsResultType<ResultCreateCategoryType> = await HttpUtils.request('/categories/income', 'POST', true, {
                title: (this.inputElement as HTMLInputElement).value
            });

            if(result.redirect) {
                return this.openNewRoute(result.redirect);
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                return alert('Возникла ошибка добавлении категории расхода');
            }
            return this.openNewRoute('/income');
        }
    }


}