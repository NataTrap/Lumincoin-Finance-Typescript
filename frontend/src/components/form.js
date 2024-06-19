import config from "../config/config";

export class Form {
    constructor(openNewRote, page) {
        this.openNewRoute = openNewRote
        this.page = page

        console.log("SignUp")

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
                    regex: /^[A-Z][a-z]+\s*$/,
                    valid: false,
                },
                {
                    name: 'lastName',
                    id: 'lastName',
                    element: null,
                    regex: /^[A-Z][a-z]+\s*$/,
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


        // this.processElement = document.getElementById('process-button');
        this.processElement.onclick = function () {
            that.processForm();
        }


        // this.processElement.addEventListener('click', this.processForm.bind(this))


    }


    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = 'red';
            field.valid = false;

        } else {
            element.style.borderColor = '';
            field.valid = true;
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

            if (this.page === 'sign-up') {
                if (this.passwordElement.value === this.confirmPasswordElement.value) {
                    this.confirmPasswordElement.style.borderColor = ''
                } else {
                    this.confirmPasswordElement.style.borderColor = 'red'
                }
            }

            return validForm
    }

    async processForm() {
        if (this.validateForm()) {
            try {
                if (this.page === 'sign-up') {
                    this.commonErrorSignUpElement.style.display = 'none';
                    const response = await fetch(config.api + '/signup', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify({
                            name: this.nameElement.value,
                            lastName: this.lastNameElement.value,
                            email: this.emailElement.value,
                            password: this.passwordElement.value,
                            passwordRepeat: this.passwordElement.value,

                        })
                    });

                    const result = await response.json()
                    console.log(result)

                    if (result.error || !result.user || (result.user && (!result.user.id || !result.user.email || !result.user.name || !result.user.lastName))) {
                        this.commonErrorSignUpElement.style.display = 'block';
                        throw new Error(result.message);
                    }

                    localStorage.setItem('userInfo', JSON.stringify({
                        id: result.user.id,
                        email: result.user.email,
                        name: result.user.name,
                        lastName: result.user.lastName

                    }))

                    this.openNewRoute('/')

                }
            } catch (error) {
                return console.log(error)
            }

        }


        if (this.page === 'login') {
            this.commonErrorLoginElement.style.display = 'none'
            try {
                const response = await fetch(config.api + '/login', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.emailElement.value,
                        password: this.passwordElement.value,
                        rememberMe: this.rememberMeElement.checked
                    })
                });

                const result = await response.json()
                console.log(result)

                if (result.error || !result.tokens || (result.tokens && (!result.tokens.accessToken || !result.tokens.refreshToken))
                    || !result.user || (result.user && (!result.user.name || !result.user.lastName || !result.user.id))) {
                    this.commonErrorLoginElement.style.display = 'block'
                    throw new Error(result.message);
                }


                localStorage.setItem('accessToken', result.tokens.accessToken)
                localStorage.setItem('refreshToken', result.tokens.refreshToken)
                localStorage.setItem('userInfo', JSON.stringify({
                    name: result.user.name,
                    lastName: result.user.lastName,
                    id: result.user.id
                }))

                this.openNewRoute('/')

            } catch (error) {
                return console.log(error)
            }
        }


    }


}