import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";

export class Form {
    constructor(openNewRote, page) {
        this.openNewRoute = openNewRote

        this.page = page
        this.processElement = document.getElementById('process-button')
        this.passwordElement = document.getElementById('password');
        this.nameElement = document.getElementById('name')
        this.lastNameElement = document.getElementById('lastName')
        this.emailElement = document.getElementById('email')
        this.commonErrorLoginElement = document.getElementById('common-error-login')
        this.commonErrorSignUpElement = document.getElementById('common-error-sign-up')
        this.confirmPasswordElement = document.getElementById('confirm-password')
        this.rememberMeElement = document.getElementById('flexCheckDefault')

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            }
        ]


        if (page === 'sign-up') {
            this.fields.unshift(
                {
                    name: 'name',
                    id: 'name',
                    element: null,
                    // regex: /^[A-Z][А-Я][a-z][а-я]+\s*$/,
                    valid: false,
                },
                {
                    name: 'lastName',
                    id: 'lastName',
                    element: null,
                    // regex: /^[A-Z][А-Я][a-z][а-я]+\s*$/,
                    valid: false,
                }
            )

            this.fields.push(
                {
                    name: 'confirm-password',
                    id: 'confirm-password',
                    element: null,
                    regex: "",
                    valid: false,
                }
            )
        }


        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this);
            }
        });

        this.processElement.onclick = function () {
            that.processForm();
        }
    }


    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = 'red';
            field.valid = false;

        } else {
            element.style.borderColor = '';
            field.valid = true;
        }

        if (this.page === 'sign-up') {
            this.confirmPasswordElement.style.borderColor = ''
            if (this.passwordElement.value === this.confirmPasswordElement.value) {
                this.confirmPasswordElement.style.borderColor = ''
            } else {
                this.confirmPasswordElement.style.borderColor = 'red'
            }
        }

        this.validateForm()
    }


    validateForm() {
            const validForm = this.fields.every(item => item.valid);
            if (validForm) {
                this.processElement.removeAttribute('disabled')
            } else {
                this.processElement.setAttribute('disabled', 'disabled')
            }

            return validForm
    }

    async processForm() {
        if (this.validateForm()) {
            try {
                if (this.page === 'sign-up') {

                    this.commonErrorSignUpElement.style.display = 'none';

                    let result = await HttpUtils.request('/signup', 'POST', false, {
                        name: this.nameElement.value,
                        lastName: this.lastNameElement.value,
                        email: this.emailElement.value,
                        password: this.passwordElement.value,
                        passwordRepeat: this.passwordElement.value,

                    } )

                    if (result.error || !result.response || (result.response && ( !result.response.user || (result.response.user && (!result.response.user.id || !result.response.user.email || !result.response.user.name || !result.response.user.lastName))))) {
                        this.commonErrorSignUpElement.style.display = 'block';
                        throw new Error(result.message);
                    }




                    AuthUtils.setAuthInfo(null, null, {
                        name: result.response.user.name,
                        email: this.emailElement.value,
                        lastName: result.response.user.lastName,
                        id: result.response.user.id
                    })

                    if (localStorage.getItem('accessToken')) {
                        return this.openNewRoute('/login')
                    }

                    this.openNewRoute('/login')

                }
            } catch (error) {
                return console.log(error)
            }

        }


        if (this.page === 'login') {

            // this.commonErrorLoginElement.style.display = 'none'
            try {

                const result = await HttpUtils.request('/login', 'POST', false, {
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                })

                if (result.error || !result.response || (result.response && ( !result.response.tokens || (result.response.tokens && (!result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user ||
                    (result.response.user && (!result.response.user.name || !result.response.user.lastName || !result.response.user.id) )))))) {
                    // this.commonErrorSignUpElement.style.display = 'block';
                    throw new Error(result.message);
                }




                AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                    name: result.response.user.name,
                    lastName: result.response.user.lastName,
                    id: result.response.user.id
                })



                this.openNewRoute('/')

            } catch (error) {
                return console.log(error)
            }





        }


    }


}