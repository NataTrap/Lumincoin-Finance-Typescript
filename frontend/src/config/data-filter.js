// export class DateFilter { //отвечает за выбор периода и интервалов дат
//     constructor() {
//
//         this.weekElement = document.getElementById('week')
//         this.todayElement = document.getElementById('today')
//
//         const sub1month = new Date();
//         sub1month.setMonth(sub1month.getMonth() - 1);
//         console.log(sub1month)
//
//
//         const sub1day = new Date();
//         sub1day.setDate(sub1day.getDate() - 1);
//         console.log(sub1day)
//
//
//         this.weekElement.addEventListener('click', this.dateWeek.bind(this))
//         this.todayElement.addEventListener('click', this.dateToday.bind(this))
//     }
//
//     dateWeek() {
//
//         this.weekElement.classList.add('active')
//         const sub1week = new Date();
//         sub1week.setDate(sub1week.getDate() - 7);
//         console.log(sub1week) // -1 неделя
//     }
//
//
//     dateToday () {
//         this.todayElement.classList.add('active')
//         const sub1day = new Date();
//         sub1day.setDate(sub1day.getDate());
//         console.log(sub1day)
//     }
//
//
//
//
// }




export class DateFilter { //отвечает за выбор периода и интервалов дат
    constructor(getOperations) {
        this.getOperations = getOperations; //при изменении фильтра делает новый запрос на сервер(метод из файла income-expenses.js)
        this.periodButtons = document.querySelectorAll('.such-button');
        this.startDatePicker = document.getElementById('start-date');
        this.endDatePicker = document.getElementById('end-date');
        this.initButtonsListeners();
    }

    initButtonsListeners() { //обработчики событий на кнопки периодов и выбора даты
        this.periodButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.periodButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const period = button.getAttribute('data-period'); //получаем строковое значение
                // периода из атрибута для вычисления периода в calculateDates
                this.filterChange(period);
            });
        });

        this.startDatePicker.addEventListener('change', () => {
            const activeButton = document.querySelector('.such-button.active');
            if (activeButton && activeButton.getAttribute('data-period') === 'interval') {
                this.filterChange('interval');
            }
        });

        this.endDatePicker.addEventListener('change', () => {
            const activeButton = document.querySelector('.such-button.active');
            if (activeButton && activeButton.getAttribute('data-period') === 'interval') {
                this.filterChange('interval');
            }
        });
    }

    filterChange(period) {
        const { dateFrom, dateTo } = this.calculateDates(period); //получаем dateFrom и dateTo для запроса
        this.getOperations(period, dateFrom, dateTo); //передаем полученные данные для запроса при изменении фильтра
    }

    calculateDates(period) { //вычисляем периоды для фильтра
        let dateFrom = '';
        let dateTo = '';
        const today = new Date();

        switch (period) {
            case 'today':
                dateFrom = dateTo = today.toISOString().split('T')[0];
                break;
            case 'week':
                const dayOfWeek = today.getDay();
                const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                const startOfWeek = new Date(today.setDate(diff));
                dateFrom = startOfWeek.toISOString().split('T')[0];
                dateTo = new Date().toISOString().split('T')[0];
                break;
            case 'month':
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                dateFrom = startOfMonth.toISOString().split('T')[0];
                dateTo = new Date().toISOString().split('T')[0];
                break;
            case 'year':
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                dateFrom = startOfYear.toISOString().split('T')[0];
                dateTo = new Date().toISOString().split('T')[0];
                break;
            case 'all':
                dateFrom = '';
                dateTo = '';
                break;
            case 'interval':
                dateFrom = this.startDatePicker.value;
                dateTo = this.endDatePicker.value;
                break;
        }

        return { dateFrom, dateTo };
    }
}