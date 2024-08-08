import { CategoryType } from "../../types/category.type";
import { HttpUtilsResultType } from "../../types/http-utils/httpUtils.type";
import { OperationsType } from "../../types/operations.type";
import { OpenNewRoute } from "../../types/route.type";
import {HttpUtils} from "../../utils/http-utils";

export class CreateIncomeInIncomeExpense {
    private openNewRoute: OpenNewRoute
    private incomeOperation: CategoryType[]
    private typeSelectElement: HTMLSelectElement | null
    private categorySelectElement: HTMLSelectElement | null
    private sumElement: HTMLInputElement | null
    private dateElement: HTMLInputElement | null
    private commentElement: HTMLInputElement | null
    
    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        this.incomeOperation = [];
        this.typeSelectElement = document.getElementById('type-select') as HTMLSelectElement;
        this.categorySelectElement = document.getElementById('category')  as HTMLSelectElement;
        this.sumElement = document.getElementById('sum') as HTMLInputElement;
        this.dateElement = document.getElementById('date') as HTMLInputElement;
        this.commentElement = document.getElementById('comment') as HTMLInputElement;
        this.getIncomeCategories().then();

      
       ( document.getElementById('create-button') as HTMLElement).addEventListener('click', this.saveOperation.bind(this));

        (this.typeSelectElement as HTMLSelectElement).addEventListener('change', () => {
            this.showCategories(this.incomeOperation);
        })

    }


   private async getIncomeCategories(): Promise<void> {
        const result: HttpUtilsResultType<CategoryType[]> = await HttpUtils.request('/categories/income');
        this.incomeOperation = result.response as CategoryType[];
        this.showCategories(this.incomeOperation);
        this.showOption()
    }


    private showOption(): void {
        const optionExpenseElement = document.createElement('option');
        optionExpenseElement.setAttribute('value', 'income');
        optionExpenseElement.setAttribute('selected', 'selected')
        optionExpenseElement.innerText = 'Доход'
        if(this.typeSelectElement) {
            this.typeSelectElement.appendChild(optionExpenseElement)
            this.showCategories(this.incomeOperation)
        }
      
    }

    private showCategories(incomeOperation: CategoryType[]): void {
        for (let i = 0; i < incomeOperation.length; i++) {
            const optionElement: HTMLOptionElement | null = document.createElement('option');
            optionElement.setAttribute("value", incomeOperation[i].id);
            optionElement.innerText = incomeOperation[i].title;
            if( this.categorySelectElement) {
                this.categorySelectElement.appendChild(optionElement);
            }
         
        }

    }


    private validateForm(): boolean {
        let isValid: boolean = true;
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

    async saveOperation(e: Event) {
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