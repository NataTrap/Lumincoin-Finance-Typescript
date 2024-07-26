import {HttpUtils} from "../../utils/http-utils";
import {DefaultResponseType} from "../../types/default-response.type";

export class CreateExpense {
    readonly openNewRoute
    readonly inputElement: HTMLInputElement | null
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.inputElement = document.querySelector('input');
        document.getElementById('create-button').addEventListener('click', this.saveCategory.bind(this));
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

    async saveCategory(e){
        e.preventDefault;
        if(this.validateForm()){
            const result  = await HttpUtils.request('/categories/expense', 'POST', true, {
                title: this.inputElement.value
            });

            if(result.redirect) {
                return this.openNewRoute(result.redirect);
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                return alert('Возникла ошибка добавлении категории расхода');
            }
            return this.openNewRoute('/expense');
        }
    }
}