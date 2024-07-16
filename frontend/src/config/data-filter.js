
export class DateFilter {
    constructor(getOperations) {
        this.getOperations = getOperations;
        this.periodButtons = document.querySelectorAll('.such-button');
        this.startDatePicker = document.getElementById('start-date');
        this.endDatePicker = document.getElementById('end-date');
        this.initButtonsListeners();
    }

    initButtonsListeners() {
        this.periodButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.periodButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const period = button.getAttribute('data-period');
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
        const { dateFrom, dateTo } = this.calculateDates(period);
        this.getOperations(period, dateFrom, dateTo);
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