import { CategoryType } from "../../types/category.type";
import { HttpUtilsResultType } from "../../types/http-utils/httpUtils.type";
import { OperationsType } from "../../types/operations.type";
import { OpenNewRoute } from "../../types/route.type";
import {HttpUtils} from "../../utils/http-utils";

export class CreateExpenseInIncomeExpense {
    private openNewRoute: OpenNewRoute
    private expenseOperation: CategoryType[]
    private typeSelectElement: HTMLSelectElement | null
    private categorySelectElement: HTMLSelectElement | null
    private sumElement: HTMLInputElement | null
    private dateElement: HTMLInputElement | null
    private commentElement: HTMLInputElement | null

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        this.expenseOperation = [];
        this.typeSelectElement = document.getElementById('type-select') as HTMLSelectElement;
        this.categorySelectElement = document.getElementById('category') as HTMLSelectElement;
        this.sumElement = document.getElementById('sum') as HTMLInputElement;
        this.dateElement = document.getElementById('date') as HTMLInputElement;
        this.commentElement = document.getElementById('comment') as HTMLInputElement;
        this.getExpenseCategories().then();


        (document.getElementById('create-button') as HTMLElement).addEventListener('click', this.saveOperation.bind(this));
        
        (this.typeSelectElement as HTMLElement ).addEventListener('change', () => { //обработчик события на изменение селекта типа
            this.showCategories(this.expenseOperation);
        })
    }


    private async getExpenseCategories(): Promise<void> {
        const result: HttpUtilsResultType<CategoryType[]> = await HttpUtils.request('/categories/expense');
        this.expenseOperation = result.response as CategoryType[];
        this.showCategories(this.expenseOperation);
        this.showOption()
    }


    private showOption(): void {
        const optionExpenseElement = document.createElement('option');
        optionExpenseElement.setAttribute('value', 'expense');
        optionExpenseElement.setAttribute('selected', 'selected')
        optionExpenseElement.innerText = 'Расход'
        if(this.typeSelectElement) {
            this.typeSelectElement.appendChild(optionExpenseElement)
        }
        this.showCategories(this.expenseOperation)
    }

    private showCategories(expenseOperation: CategoryType[]): void {
        for (let i = 0; i < expenseOperation.length; i++) {
            const optionElement = document.createElement('option');
            optionElement.setAttribute("value", expenseOperation[i].id);
            optionElement.innerText = expenseOperation[i].title;
            if(this.categorySelectElement) {
                this.categorySelectElement.appendChild(optionElement);
            }
          
        }

    }


    private validateForm(): boolean {
        let isValid = true;
        let textInputArray = [
            this.typeSelectElement,
            this.categorySelectElement,
            this.sumElement,
            this.dateElement,
            this.commentElement
        ]
        for (let i = 0; i < textInputArray.length; i++) {
            if (textInputArray[i]?.value) {
                textInputArray[i]?.classList.remove('is-invalid');
            } else {
                textInputArray[i]?.classList.add('is-invalid');
                isValid = false
            }
        }
        return isValid;
    }

    private async saveOperation(e: Event): Promise<void> {
        e.preventDefault();
        if (this.validateForm()) {
            const result: HttpUtilsResultType<OperationsType> = await HttpUtils.request('/operations', 'POST', true, {
                type: (this.typeSelectElement as HTMLSelectElement).value,
                amount: (this.sumElement as HTMLInputElement).value,
                date: (this.dateElement as HTMLInputElement).value,
                comment: (this.commentElement as HTMLInputElement).value,
                category_id: Number((this.categorySelectElement as HTMLSelectElement).value)
            });
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
             
                return alert('Возникла ошибка при запросе категорий');
            }
            return this.openNewRoute('/income-expenses');
        }
    }


}