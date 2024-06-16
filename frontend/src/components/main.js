import Chart from 'chart.js/auto';

export class Main {
    constructor() {
        console.log("Main");
        this.chartIncome(); // Вызываем метод создания диаграммы при создании экземпляра класса
        this.chartExpenses();
    }

    chartIncome() {

        const ctx = document.getElementById('income');

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Orange'],
                datasets: [{
                    label: 'My First Dataset',
                    data: [40, 40, 10, 20, 20],
                    backgroundColor: [
                        '#DC3545',
                        '#0D6EFD',
                        '#FFC107',
                        '#20C997',
                        '#FD7E14'

                    ],
                    hoverOffset: 5
                }]
            },
            options: {
            }
        });

    }


    chartExpenses() {
        const ctx = document.getElementById('expenses');

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Orange'],
                datasets: [{
                    label: 'My First Dataset',
                    data: [20, 40, 20, 40, 20],
                    backgroundColor: [
                        '#DC3545',
                        '#0D6EFD',
                        '#FFC107',
                        '#20C997',
                        '#FD7E14'

                    ],
                    hoverOffset: 5
                }]
            },
            options: {
            }
        });

    }

}

