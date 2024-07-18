import {Main} from "./components/main";
import {Form} from "./components/auth/form";
import {IncomeExpenses} from "./components/income-expenses/income-expenses";
import {Logout} from "./components/auth/logout";
import {CreateIncome} from "./components/income/create-income";
import {Income} from "./components/income/income";
import {EditExpense} from "./components/expenses/edit-expense";
import {DeleteExpense} from "./components/expenses/delete-expense";
import {DeleteIncome} from "./components/income/delete-income";
import {EditIncome} from "./components/income/edit-income";
import {HttpUtils} from "./utils/http-utils";
import {AuthUtils} from "./utils/auth-utils";
import {EditIncomeExpense} from "./components/income-expenses/edit-income-expense";
import {DeleteIncomeExpense} from "./components/income-expenses/delete-income-expense";
import {Expense} from "./components/expenses/expense";
import {CreateExpense} from "./components/expenses/create-expense";
import {CreateExpenseInIncomeExpense} from "./components/income-expenses/create-expense-in-income-expense";
import {CreateIncomeInIncomeExpense} from "./components/income-expenses/create-income-in-income-expense";


export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main(this.openNewRoute.bind(this));
                },
                scripts: [
                    'moment.min.js',
                    'locales.js',

                ],
                styles: [
                    'bootstrap-datepicker.css',
                ]
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/auth/login.html',
                useLayout: false,
                load: () => {
                    new Form(this.openNewRoute.bind(this), 'login');
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new Form(this.openNewRoute.bind(this), 'sign-up');
                }
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income-expenses',
                title: ' Доходы & Расходы',
                filePathTemplate: '/templates/income-expenses/income-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpenses(this.openNewRoute.bind(this));
                },
                scripts: [
                    'moment.min.js',
                    'locales.js',

                ],
            },
            {
                route: '/edit-income-expense',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/income-expenses/edit-income-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncomeExpense(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/delete-income-expense',
                load: () => {
                    new DeleteIncomeExpense(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/expense/expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expense(this.openNewRoute.bind(this))
                },
                style: [
                    ' style.scss'
                ]
            },
            {
                route: '/create-expense',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/expense/create-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateExpense(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/edit-expense',
                title: 'Редактирование расхода',
                filePathTemplate: '/templates/expense/edit-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditExpense(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/create-expense',
                title: 'Создание расхода',
                filePathTemplate: '/templates/expense/create-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateExpense(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/delete-expense',
                load: () => {
                    new DeleteExpense(this.openNewRoute.bind(this))
                }
            },

            {
                route: '/income',
                title: ' Доходы',
                filePathTemplate: '/templates/income/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Income(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/create-income',
                title: ' Создание категории доходов',
                filePathTemplate: '/templates/income/create-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncome(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/create-expense-in-income-expense',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/income-expenses/create-income-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateExpenseInIncomeExpense(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/create-income-in-income-expense',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/income-expenses/create-income-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CreateIncomeInIncomeExpense(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/edit-income',
                title: 'Редактирование дохода',
                filePathTemplate: '/templates/income/edit-income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new EditIncome(this.openNewRoute.bind(this))
                }
            },
            {
                route: '/delete-income',
                load: () => {
                    new DeleteIncome(this.openNewRoute.bind(this))
                }
            },
        ]

    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));

    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute)
    }

    async clickHandler(e) {
        let element = null
        if (e.target.nodeName === 'A') {
            element = e.target
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode
        }


        if (element) {
            e.preventDefault()
            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '')
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url)
        }
    }

    async activateRoute() {

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' |  Lumincoin Finance'
            }


            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement
                if (newRoute.useLayout ) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text())
                    contentBlock = document.getElementById('content-layout');

                    this.profileNameElement = document.getElementById('current-name')
                    let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                    if (userInfo) {
                        userInfo = JSON.parse(userInfo)
                        if (userInfo.name) {
                            this.profileNameElement.innerText = userInfo.name + ' ' + userInfo.lastName
                        }
                    }

                    this.getBalance().then()
                    this.activateMenuItem(newRoute)
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text())

            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load()
            }

        } else {
            console.log("Not route Found")
            history.pushState({}, '', '/');
            await this.activateRoute()
        }
    }

    async getBalance() {
        const result = await HttpUtils.request('/balance')
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при запросе Баланса. Обратитесь в поддержку ')
        }

        document.getElementById('balance').innerText = result.response.balance + '$'
    }

    activateMenuItem(route) {
        document.querySelectorAll('#sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href')
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active')
            } else {
                item.classList.remove('active')
            }
        })
    }
}