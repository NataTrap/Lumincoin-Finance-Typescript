import {HttpUtils} from "../../utils/http-utils";
import { OpenNewRoute } from "../../types/route.type";
import { HttpUtilsResultType } from "../../types/http-utils/httpUtils.type";
import { ResultCreateCategoryType } from "../../types/result.type";
import { DefaultErrorResponseType } from "../../types/default-error-response.type";

export class CreateExpense {
    readonly openNewRoute: OpenNewRoute
    readonly inputElement: HTMLInputElement | null
    private createButton:  HTMLElement | null
    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        this.inputElement = document.querySelector('input');
        this.createButton =  document.getElementById('create-button')
        if(this.createButton) {
            this.createButton.addEventListener('click', this.saveCategory.bind(this));
        }
        }
      

    private validateForm(): boolean{
        let isValid: boolean = true;
        if (this.inputElement) {
            if(this.inputElement.value){
                this.inputElement.classList.remove('is-invalid');
            } else {
                this.inputElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }

    async saveCategory(e: Event): Promise<void>{
        e.preventDefault;
        if(this.validateForm()){
            const result: HttpUtilsResultType<ResultCreateCategoryType>  = await HttpUtils.request('/categories/expense', 'POST', true, {
                title: (this.inputElement as HTMLInputElement).value
            });

            if(result.redirect) {
                return this.openNewRoute(result.redirect);
            
            }

            const response: ResultCreateCategoryType | DefaultErrorResponseType | null = result.response;
            if (result.error || !response || (response && response.error)) {
                return alert('Возникла ошибка добавлении категории расхода');
            }
            return this.openNewRoute('/expense');
        }
    }
}