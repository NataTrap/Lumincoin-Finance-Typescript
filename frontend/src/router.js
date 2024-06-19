import {Main} from "./components/main";
import {Form} from "./components/form";
import {IncomeExpenses} from "./components/income-expenses";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [

            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load: () => {
                    new Form(this.openNewRoute.bind(this), 'login');
                }
            },

            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main();
                }
            },
            {
                route: '/income-expenses',
                title: ' Доходы & Расходы',
                filePathTemplate: '/templates/income-expenses/income-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                  new IncomeExpenses();
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/income-expenses/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/income',
                title: ' Доходы',
                filePathTemplate: '/templates/income-expenses/income.html',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/create-income',
                title: ' Создание категории доходов',
                filePathTemplate: '/templates/income-expenses/create-income.html',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/create-expense',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/income-expenses/create-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/create-income-expense',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/income-expenses/create-income-expense.html',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/edit-expenses',
                title: 'Редактирование расхода',
                filePathTemplate: '/templates/income-expenses/edit-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/edit-income',
                title: 'Редактирование дохода',
                filePathTemplate: '/templates/income-expenses/edit-income.html',
                useLayout: '/templates/layout.html',
                load: () => {

                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                load: () => {
                    new Form(this.openNewRoute.bind(this), 'sign-up');
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
            if (!url ||  (currentRoute === url.replace('#', ''))|| url.startsWith('javascript:void(0)')) {
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
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text())
                    contentBlock = document.getElementById('content-layout');
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

 }