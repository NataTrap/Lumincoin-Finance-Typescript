import {HttpUtils} from "../utils/http-utils";

export class Income {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        const urlParams = new URLSearchParams(window.location.search)
        this.id = urlParams.get('id');

        this.getIncome().then()
    }

    async getIncome() {
        const result = await HttpUtils.request('/categories/income')

        if(result.redirect){
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            console.log(result.response.message)
            return alert('Возникла ошибка при запросе. Обратитесь в поддержку ')
        }

        this.getIncomeList(result.response)

    }

    getIncomeList(income) {

        const cardsElement = document.getElementById('cards');

        for (let i = 0; i < income.length; i++) {

            const cardElement = document.createElement('div');
            cardElement.className = 'card';

            const cardBodyElement = document.createElement('div');
            cardBodyElement.className = 'card-body';

            const cardTitleElement = document.createElement('h5');
            cardTitleElement.className = 'card-title';
            cardTitleElement.innerHTML = income[i].title;

            const editElement = document.createElement('a');
            editElement.setAttribute('href', '/edit-income?id=' + income[i].id);
            editElement.setAttribute('type', 'button');
            editElement.className = 'btn btn-primary';
            editElement.innerHTML = 'Редактировать';

            const deleteElement = document.createElement('a');
            deleteElement.setAttribute('href', 'javascript:void(0)');
            deleteElement.setAttribute('type', 'button');
            deleteElement.setAttribute('data-bs-toggle', 'modal');
            deleteElement.setAttribute('data-bs-target', '#exampleModalCenter');
            deleteElement.setAttribute('data-id', income[i].id);
            deleteElement.className = 'btn btn-danger delete-btn';
            deleteElement.innerHTML = 'Удалить';

            const cardRowElement = document.getElementById('row')

            cardBodyElement.appendChild(cardTitleElement);
            cardBodyElement.appendChild(editElement);
            cardBodyElement.appendChild(deleteElement);
            cardElement.appendChild(cardBodyElement);
            cardsElement.appendChild(cardElement);
            cardRowElement.appendChild(cardsElement);


        }

        const cardElement = document.createElement('div');
        cardElement.className = 'card';

        const cardBodyElement = document.createElement('div');
        cardBodyElement.className = 'card-body card-body-new';

        const newElement = document.createElement('a');
        newElement.id = 'new-element'
        newElement.setAttribute('href', '/create-income');
        newElement.innerHTML = '+';

        cardBodyElement.appendChild(newElement);
        cardElement.appendChild(cardBodyElement);
        cardsElement.appendChild(cardElement);

        this.categoryDeleteEventListeners()
    }

    categoryDeleteEventListeners() { //передаем id операции в каждую кнопку удаления
        const deleteButtons = document.querySelectorAll('.delete-btn');
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', (event) => {
                let operationId = event.target.closest('.delete-btn').getAttribute('data-id');
                let deleteBtn = document.getElementById('delete-btn');
                deleteBtn.setAttribute('href', '/delete-income?id=' + operationId);
            });
        }
    }


}