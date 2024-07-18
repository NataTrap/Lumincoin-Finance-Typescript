import {HttpUtils} from "../../utils/http-utils";

export class EditIncomeExpense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get('id')
        if (!id) {
            return this.openNewRoute('/')
        }

        this.typeSelectElement = document.getElementById('type-select')
        this.categorySelectElement = document.getElementById('category')
        this.sumElement = document.getElementById('sum')
        this.dateElement = document.getElementById('date')
        this.commentElement = document.getElementById('comment')
        this.idElement = document.getElementById('id')


        this.typeSelectElement.addEventListener('change', () => { //если юзер поменял тип в селекте, то меняем наполнение для категорий
            this.showCategories(this.incomeOperation, this.expenseOperation);
        });


        document.getElementById('update-button').addEventListener('click', this.updateIncomeExpense.bind(this))
        this.getOperation(id).then()
    }

    async getIncomeCategories() {
        const result = await HttpUtils.request('/categories/income');
        this.incomeOperation = result.response;
    }

    async getExpenseCategories() {
        const result = await HttpUtils.request('/categories/expense');
        this.expenseOperation = result.response;
    }


    showCategories(incomeOperation, expenseOperation) {
        this.categorySelectElement.innerHTML = '';
        if (this.typeSelectElement.value === 'income') {
            for (let i = 0; i < incomeOperation.length; i++) {
                const optionElement = document.createElement('option');
                optionElement.setAttribute("value", incomeOperation[i].id);
                optionElement.innerText = incomeOperation[i].title;
                this.categorySelectElement.appendChild(optionElement);
            }
        } else if (this.typeSelectElement.value === 'expense') {
            for (let i = 0; i < expenseOperation.length; i++) {
                const optionElement = document.createElement('option');
                optionElement.setAttribute("value", expenseOperation[i].id);
                optionElement.innerText = expenseOperation[i].title;
                this.categorySelectElement.appendChild(optionElement);
            }
        }
    }


    async getOperation(id) {
        const result = await HttpUtils.request('/operations/' + id)
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе операции. Обратитесь в поддержку')
        }

        this.operationOriginalData = result.response

        for (let i = 0; i < this.typeSelectElement.options.length; i++) {
            if (this.typeSelectElement.options[i].value === result.response.type) {
                this.typeSelectElement.selectedIndex = i;
            }
        }

        await this.getIncomeCategories();
        await this.getExpenseCategories();
        this.showCategories(this.incomeOperation,this.expenseOperation );
        this.showOperation(result.response)
    }




    showOperation(operation) {
        this.sumElement.value = operation.amount
        this.categorySelectElement.value = operation.category
        this.dateElement.value = operation.date
        this.commentElement.value = operation.comment


        for (let i = 0; i < this.typeSelectElement.options.length; i++) {
            if (this.typeSelectElement.options[i].value === operation.type) {
                this.typeSelectElement.selectedIndex = i
            }
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


    async updateIncomeExpense(e, id) {
        e.preventDefault()
        if (this.validateForm()) {
            const changedData = {}
            if (this.sumElement.value !== this.operationOriginalData.amount) {
                changedData.amount = this.sumElement.value
            }
            if (this.typeSelectElement.value !== this.operationOriginalData.type) {
                changedData.type = this.sumElement.value
            }
            if (this.categorySelectElement.value !== this.operationOriginalData.category) {
                changedData.category = this.categorySelectElement.value
            }
            if (this.dateElement.value !== this.operationOriginalData.date) {
                changedData.date = this.dateElement.value
            }
            if (this.commentElement.value !== this.operationOriginalData.comment) {
                changedData.comment = this.commentElement.value
            }

            if (Object.keys(changedData).length > 0) {

                const result = await HttpUtils.request('/operations/' + this.operationOriginalData.id, 'PUT', true, {
                    type: this.typeSelectElement.value,
                    amount: this.sumElement.value,
                    date: this.dateElement.value,
                    comment: this.commentElement.value,
                    category_id: Number(this.categorySelectElement.value)
                }, changedData)

                if (result.redirect) {
                    return this.openNewRoute(result.redirect)
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    return alert('Возникла ошибка при Редактирование. Обратитесь в поддержку')
                }

                return this.openNewRoute('/income-expenses')
            }
        }
    }
}