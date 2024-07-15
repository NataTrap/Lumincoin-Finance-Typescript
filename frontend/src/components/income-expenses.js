import {HttpUtils} from "../utils/http-utils";

export class IncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getOperations('today').then();
    }

    async getOperations(period, dateFrom = '', dateTo = '') { //запрос на сервер для получения операций с фильтром
        let url = '/operations?period=interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo; //данные подставляются из фильтра
        if (period === 'all') {
            url = '/operations?period=all';
        }
        const result = await HttpUtils.request(url);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе операций');
        }
        this.showIncomeAndExpensesList(result.response);
    }


    showIncomeAndExpensesList(operations) { //рисуем таблицу с операциями
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = ''; // Очищаем таблицу перед отображением новых данных
        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');
            trElement.insertCell().innerText = i + 1;
            trElement.insertCell().innerText = operations[i].type === 'expense' ? 'Расход' : 'Доход';
            trElement.cells[1].className = operations[i].type === 'expense' ? 'text-danger' : 'text-success';
            trElement.insertCell().innerText = operations[i].category;
            trElement.insertCell().innerText = operations[i].amount + '$';
            const date = new Date(operations[i].date);
            trElement.insertCell().innerText = date.toLocaleDateString('ru-Ru');
            trElement.insertCell().innerText = operations[i].comment;

            trElement.insertCell().innerHTML = '<div class="order-tools">' +
                '<a href="/orders/edit?id='+ operations[i].id +'" class="fas fa-edit"></a>' +
                '<a href="/orders/delete?id='+ operations[i].id +'" class="fas fa-trash"></a>' +
                '</div>'


            recordsElement.appendChild(trElement);
        }








    }





}