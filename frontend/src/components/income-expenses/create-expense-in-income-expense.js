import {HttpUtils} from "../../utils/http-utils";

export class CreateExpenseInIncomeExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.expenseOperation = null;
        this.typeSelectElement = document.getElementById('type-select');
        this.categorySelectElement = document.getElementById('category');
        this.sumElement = document.getElementById('sum');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');
        this.getExpenseCategories().then();

        this.typeSelectElement.addEventListener('change', () => {
            this.showCategories(this.expenseOperation);
        })

        document.getElementById('create-button').addEventListener('click', this.saveOperation.bind(this));
    }


    async getExpenseCategories() {
        const result = await HttpUtils.request('/categories/expense');
        this.expenseOperation = result.response;
        this.showCategories([], this.expenseOperation);
        this.showOption()
    }


    showOption() {
        const optionExpenseElement = document.createElement('option');
        optionExpenseElement.setAttribute('value', 'expense');
        optionExpenseElement.setAttribute('selected', 'selected')
        optionExpenseElement.innerText = 'Расход'
        this.typeSelectElement.appendChild(optionExpenseElement)
        this.showCategories(this.expenseOperation)
    }

    showCategories(expenseOperation) {
        for (let i = 0; i < expenseOperation.length; i++) {
            const optionElement = document.createElement('option');
            optionElement.setAttribute("value", expenseOperation[i].id);
            optionElement.innerText = expenseOperation[i].title;
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