import {HttpUtils} from "../utils/http-utils";

export class Expense {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        const urlParams = new URLSearchParams(window.location.search)
        this.id = urlParams.get('id');

        this.getExpense().then()
    }

    async getExpense(){ //запрос на получение категорий расходов
        const result = await HttpUtils.request('/categories/expense');
        if(result.redirect){
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе категорий расходов');
        }

        this.showExpenseList(result.response);
    }


    showExpenseList(expense) { //рисуем блоки с категориями
        const cardsElement = document.getElementById('cards');

        for (let i = 0; i < expense.length; i++) {

            const cardElement = document.createElement('div');
            cardElement.className = 'card';

            const cardBodyElement = document.createElement('div');
            cardBodyElement.className = 'card-body';

            const cardTitleElement = document.createElement('h5');
            cardTitleElement.className = 'card-title';
            cardTitleElement.innerHTML = expense[i].title;

            const editElement = document.createElement('a');
            editElement.setAttribute('href', '/edit-expense?id=' + expense[i].id);
            editElement.setAttribute('type', 'button');
            editElement.className = 'btn btn-primary';
            editElement.innerHTML = 'Редактировать';

            const deleteElement = document.createElement('a');
            deleteElement.setAttribute('href', 'javascript:void(0)');
            deleteElement.setAttribute('type', 'button');
            deleteElement.setAttribute('data-id', expense[i].id);
            deleteElement.setAttribute('data-bs-toggle', 'modal');
            deleteElement.setAttribute('data-bs-target', '#exampleModalCenter');
            deleteElement.className = 'btn btn-danger delete-btn ';
            deleteElement.innerHTML = 'Удалить';

            const cardRowElement = document.getElementById('row')

            console.log(cardsElement)
            console.log(cardElement)

            cardBodyElement.appendChild(cardTitleElement);
            cardBodyElement.appendChild(editElement);
            cardBodyElement.appendChild(deleteElement);
            cardElement.appendChild(cardBodyElement);
            cardsElement.appendChild(cardElement);
            cardRowElement.appendChild(cardsElement)


        }

        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        const cardBodyElement = document.createElement('div');
        cardBodyElement.className = 'card-body card-body-new';

        const newElement = document.createElement('a');
        newElement.id = 'new-element'
        newElement.setAttribute('href', '/create-expense');
        newElement.innerHTML = '+';

        cardBodyElement.appendChild(newElement);
        cardElement.appendChild(cardBodyElement);
        cardsElement.appendChild(cardElement);

        this.categoryDeleteEventListeners();

    }
    categoryDeleteEventListeners() { //передаем id операции в каждую кнопку удаления
        const deleteButtons = document.querySelectorAll('.delete-btn');
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', (event) => {
                let operationId = event.target.closest('.delete-btn').getAttribute('data-id');
                let deleteBtn = document.getElementById('delete-btn');
                deleteBtn.setAttribute('href', '/delete-expense?id=' + operationId);
            });
        }
    }


}