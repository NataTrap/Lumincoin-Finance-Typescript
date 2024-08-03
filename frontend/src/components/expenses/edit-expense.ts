import { GetCategoryType} from "../../types/getExpense.type";
import { HttpUtilsResultType } from "../../types/http-utils/httpUtils.type";
import { OpenNewRoute } from "../../types/route.type";
import {HttpUtils} from "../../utils/http-utils";

export class EditExpense {
    private openNewRoute: OpenNewRoute
    private id: string | null
    private title: any
    private inputElement: HTMLInputElement | null
    private saveButton: HTMLElement | null

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        this.inputElement = document.querySelector('input');
        const urlParams = new URLSearchParams(window.location.search);
        this.id = urlParams.get('id');
        this.title =  urlParams.get('title')
        this.saveButton = document.getElementById('save-button')
       
        if(this.saveButton) {
            this.saveButton.addEventListener('click', this.editCategory.bind(this));
        }
        if (!this.id) {
            this.openNewRoute('/');
            return 
        }
       
        this.showValue()
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

    private showValue (): void {
        const input =  document.getElementById('formGroupExampleInput')
        if(input) {
            (input as HTMLInputElement).value = this.title 
        } 
    }



    private async editCategory(e: Event){
        e.preventDefault;
        if(this.validateForm()){
            const result: HttpUtilsResultType<GetCategoryType> = await HttpUtils.request('/categories/expense/' + this.id, 'PUT', true, {
                title: (this.inputElement as HTMLInputElement).value
            });
            if(result.redirect){
                return this.openNewRoute(result.redirect);
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                return alert('Возникла ошибка редактировании категории дохода');
            }
            return this.openNewRoute('/expense');
        }
    }
}