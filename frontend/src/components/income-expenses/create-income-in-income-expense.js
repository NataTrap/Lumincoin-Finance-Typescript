import {HttpUtils} from "../../utils/http-utils";

export class CreateIncomeInIncomeExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.expenseOperation = null;
        this.typeSelectElement = document.getElementById('type-select');
        this.categorySelectElement = document.getElementById('category');
        this.sumElement = document.getElementById('sum');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');
        this.getIncomeCategories().then();

        this.typeSelectElement.addEventListener('change', () => {
            this.showCategories(this.incomeOperation);
        })

        document.getElementById('create-button').addEventListener('click', this.saveOperation.bind(this));
    }


    async getIncomeCategories() {
        const result = await HttpUtils.request('/categories/income');
        this.incomeOperation = result.response;
        this.showCategories([], this.incomeOperation);
        this.showOption()
    }


    showOption() {
        const optionExpenseElement = document.createElement('option');
        optionExpenseElement.setAttribute('value', 'income');
        optionExpenseElement.setAttribute('selected', 'selected')
        optionExpenseElement.innerText = 'Доход'
        this.typeSelectElement.appendChild(optionExpenseElement)
        this.showCategories(this.incomeOperation)
    }

    showCategories(incomeOperation) {
        for (let i = 0; i < incomeOperation.length; i++) {
            const optionElement = document.createElement('option');
            optionElement.setAttribute("value", incomeOperation[i].id);
            optionElement.innerText = incomeOperation[i].title;
            this.categorySelectElement.appendChild(optionElement);
        }

    }


    validateForm() {
        let isValid = true;
        let textInputArray = [
            this.typeSelectElement,
            this.categorySelectElement,
            this.sumElement,
            this.dateElement,
            this.commentElement
        ]
        for (let i = 0; i < textInputArray.length; i++) {
            if (textInputArray[i].value) {
                textInputArray[i].classList.remove('is-invalid');
            } else {
                textInputArray[i].classList.add('is-invalid');
                isValid = false
            }
        }
        return isValid;
    }

    async saveOperation(e) {
        e.preventDefault();
        if (this.validateForm()) {
            const result = await HttpUtils.request('/operations', 'POST', true, {
                type: this.typeSelectElement.value,
                amount: this.sumElement.value,
                date: this.dateElement.value,
                comment: this.commentElement.value,
                category_id: Number(this.categorySelectElement.value)
            });
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                console.log(result.response.message);
                return alert('Возникла ошибка при запросе категорий');
            }
            return this.openNewRoute('/income-expenses');
        }
    }


}