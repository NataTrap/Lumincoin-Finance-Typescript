import {HttpUtils} from "../../utils/http-utils";

export class EditExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search);
        this.id = urlParams.get('id');
        if (!this.id) {
            return this.openNewRoute('/');
        }
        this.title =  urlParams.get('title')
        this.inputElement = document.querySelector('input');


        document.getElementById('save-button').addEventListener('click', this.editCategory.bind(this));
        this.showValue()
    }



    validateForm(){
        let isValid = true;
        if(this.inputElement.value){
            this.inputElement.classList.remove('is-invalid');
        } else {
            this.inputElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    showValue () {
        let input = document.getElementById('formGroupExampleInput').value = this.title
    }


    async editCategory(e){
        e.preventDefault;
        if(this.validateForm()){
            const result = await HttpUtils.request('/categories/expense/' + this.id, 'PUT', true, {
                title: this.inputElement.value
            });
            if(result.redirect){
                return this.openNewRoute(result.redirect);
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                return alert('Возникла ошибка редактировании категории дохода');
            }
            return this.openNewRoute('/expense');
        }
    }
}