import { CategoryType } from "../../types/category.type";
import { ChangedDataType } from "../../types/change-data.type";
import { DefaultResponseType } from "../../types/http-utils/default-response.type";
import { HttpUtilsResultType } from "../../types/http-utils/httpUtils.type";
import { OperationsType } from "../../types/operations.type";
import { OpenNewRoute } from "../../types/route.type";
import {HttpUtils} from "../../utils/http-utils";

export class EditIncomeExpense {
    private openNewRoute: OpenNewRoute
    private incomeOperation: CategoryType[] = []; //сразу инициализируем, так как в конструкторе может сработать return
    private expenseOperation: CategoryType[] = [];
    private typeSelectElement: HTMLSelectElement | null
    private categorySelectElement: HTMLSelectElement | null
    private sumElement: HTMLInputElement | null
    private dateElement: HTMLInputElement | null
    private commentElement: HTMLInputElement | null
    private operationOriginalData: OperationsType | null = null;

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        this.typeSelectElement = document.getElementById('type-select') as HTMLSelectElement
        this.categorySelectElement = document.getElementById('category') as HTMLSelectElement
        this.sumElement = document.getElementById('sum') as HTMLInputElement
        this.dateElement = document.getElementById('date') as HTMLInputElement
        this.commentElement = document.getElementById('comment') as HTMLInputElement

        const urlParams = new URLSearchParams(window.location.search)
        const id: string | null = urlParams.get('id')
        if (!id) {
            this.openNewRoute('/');
            return;
        }

       

        if(this.typeSelectElement) {
            this.typeSelectElement.addEventListener('change', () => { //если юзер поменял тип в селекте, то меняем наполнение для категорий
                this.showCategories(this.incomeOperation, this.expenseOperation);
            });
        }
       
        const updateButton: HTMLElement | null = document.getElementById('update-button')
        if(updateButton) {
            updateButton.addEventListener('click', this.updateIncomeExpense.bind(this))
            this.getOperation(id).then()
        }
       
    }

    private async getIncomeCategories(): Promise<void> {
        const result: HttpUtilsResultType<CategoryType[]> = await HttpUtils.request('/categories/income');
        this.incomeOperation = result.response as CategoryType[];
    }

    private async getExpenseCategories(): Promise<void> {
        const result: HttpUtilsResultType<CategoryType[]> = await HttpUtils.request('/categories/expense');
        this.expenseOperation = result.response as CategoryType[];
    }


    public showCategories(incomeOperation: CategoryType[], expenseOperation: CategoryType[]): void {
        if (this.categorySelectElement) {
            this.categorySelectElement.innerHTML = '';
        }
       if(this.typeSelectElement) {
        if (this.typeSelectElement.value === 'income') {
            for (let i = 0; i < incomeOperation.length; i++) {
                const optionElement = document.createElement('option');
                optionElement.setAttribute("value", incomeOperation[i].id);
                optionElement.innerText = incomeOperation[i].title;
                if(this.categorySelectElement) {
                    this.categorySelectElement.appendChild(optionElement);
                }
              
            }

        } else if (this.typeSelectElement.value === 'expense') {
            for (let i = 0; i < expenseOperation.length; i++) {
                const optionElement = document.createElement('option');
                optionElement.setAttribute("value", expenseOperation[i].id);
                optionElement.innerText = expenseOperation[i].title;
                if(this.categorySelectElement) {
                    this.categorySelectElement.appendChild(optionElement);
                }
              
            }
        }
       }
    }


    private async getOperation(id: string): Promise<void> {
        const result: HttpUtilsResultType<OperationsType> = await HttpUtils.request('/operations/' + id)
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }

        const response: OperationsType | DefaultResponseType | null = result.response;
        if (result.error || !response || (response && (response as DefaultResponseType).error)) {
            console.log((response as DefaultResponseType).message);
            return alert('Возникла ошибка при запросе операции');
        }

        this.operationOriginalData = result.response as OperationsType

        if(this.typeSelectElement) {
            for (let i = 0; i < this.typeSelectElement.options.length; i++) {
                if (this.typeSelectElement.options[i].value === (result.response as OperationsType).type) {
                    this.typeSelectElement.selectedIndex = i;
                }
            }
        }
       

        await this.getIncomeCategories();
        await this.getExpenseCategories();
        this.showOperation(result.response as OperationsType)
        this.showCategories(this.incomeOperation, this.expenseOperation);
    }

    private showOperation(operation: OperationsType): void {
        if(this.sumElement && this.categorySelectElement && this.dateElement && this.commentElement) {
            this.sumElement.value = operation.amount
            this.categorySelectElement.value = operation.category
            this.dateElement.value = operation.date
            this.commentElement.value = operation.comment
            if (this.typeSelectElement) {
                for (let i = 0; i < this.typeSelectElement.options.length; i++) {
                    if (this.typeSelectElement.options[i].value === operation.type) {
                        this.typeSelectElement.selectedIndex = i
                    }
                }
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


    private async updateIncomeExpense(e: Event, id?: string): Promise<void> {
        e.preventDefault()
        if (this.validateForm()) {
            const changedData: ChangedDataType = {}
            if(this.sumElement && this.typeSelectElement && this.categorySelectElement && this.dateElement && this.commentElement && this.operationOriginalData ) {

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
            }
            
            if (Object.keys(changedData).length > 0) {
                if (this.operationOriginalData) {
                    const result: HttpUtilsResultType<OperationsType> = await HttpUtils.request('/operations/' + this.operationOriginalData.id, 'PUT', true, {
                        type: (this.typeSelectElement as HTMLSelectElement).value,
                        amount: (this.sumElement as HTMLInputElement).value,
                        date: (this.dateElement as HTMLInputElement).value,
                        comment: (this.commentElement as HTMLInputElement).value,
                        category_id: Number((this.categorySelectElement as HTMLSelectElement).value)
                    })

                    if (result.redirect) {
                        return this.openNewRoute(result.redirect)
                    }
    
                    if (result.error || !result.response || (result.response && result.response.error))  {
                        return alert('Возникла ошибка при Редактирование. Обратитесь в поддержку')
                    }
                    return this.openNewRoute('/income-expenses')
    
                }
              
              
            }
        }
    }
}