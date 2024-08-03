import {HttpUtils} from "../../utils/http-utils";
import {AuthUtils} from "../../utils/auth-utils";
import { OpenNewRoute } from "../../types/route.type";
import { FieldsType } from "../../types/filds.type";
import { HttpUtilsResultType } from "../../types/http-utils/httpUtils.type";
import { SignUpResponseType } from "../../types/auth/sign-up-response.type";
import { DefaultErrorResponseType } from "../../types/default-error-response.type";
import { LoginResponseType } from "../../types/auth/logi-in-response.type";

export class Form {
    private openNewRoute: OpenNewRoute
    private page: string
    private fields: FieldsType[] = []
    private processElement: HTMLElement | null
    private passwordElement: HTMLInputElement | null
    private nameElement: HTMLInputElement | null
    private lastNameElement: HTMLInputElement | null
    private emailElement: HTMLInputElement | null
    private commonErrorLoginElement: HTMLElement | null
    private commonErrorSignUpElement: HTMLElement | null
    private confirmPasswordElement: HTMLInputElement | null
    private rememberMeElement: HTMLInputElement | null
    private  validateField: any


    constructor(openNewRote: OpenNewRoute, page: string) {
        this.openNewRoute = openNewRote
        this.page = page
        this.processElement = document.getElementById('process-button') as HTMLElement
        this.passwordElement = document.getElementById('password') as HTMLInputElement
        this.nameElement = document.getElementById('name') as HTMLInputElement | null
        this.lastNameElement = document.getElementById('lastName') as HTMLInputElement
        this.emailElement = document.getElementById('email') as HTMLInputElement
        this.commonErrorLoginElement = document.getElementById('common-error-login')
        this.commonErrorSignUpElement = document.getElementById('common-error-sign-up')
        this.confirmPasswordElement = document.getElementById('confirm-password') as HTMLInputElement
        this.rememberMeElement = document.getElementById('flexCheckDefault') as HTMLInputElement

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
                    regex: /^[A-Z][А-Я][a-z][а-я]+\s*$/,
                    valid: false,
                },
                {
                    name: 'lastName',
                    id: 'lastName',
                    element: null,
                    regex: /^[A-Z][А-Я][a-z][а-я]+\s*$/,
                    valid: false,
                }
            )

            this.fields.push(
                {
                    name: 'confirm-password',
                    id: 'confirm-password',
                    element: null,
                    valid: false,
                }
            )
        }


        const that: Form = this;
        this.fields.forEach((item: FieldsType) => {
            item.element = document.getElementById(item.id)
            if (item.element) {
                item.element.onchange = function () {
                    that.validateField.call(that, item,  <HTMLInputElement>this);
                }
            }
           
        });

            if(this.processElement) {
                this.processElement.onclick = function () {
                    that.processForm();
                }
            }
       
    }


    // private validateField(field: FieldsType, element: HTMLInputElement): void {
    //     if(element.parentNode) {
    //         if (!element.value || !element.value.match(field.regex)) {
    //             (element.parentNode as HTMLElement).style.borderColor = 'red';
    //             field.valid = false;
    
    //         } else {
    //             element.style.borderColor = '';
    //             field.valid = true;
    //         }

    //     }
       
    //     if (this.page === 'sign-up') {
    //         if (this.confirmPasswordElement) {
    //             this.confirmPasswordElement.style.borderColor = ''
    //             if (this.passwordElement) {
    //                 if (this.passwordElement.value === this.confirmPasswordElement.value) {
    //                     (this.confirmPasswordElement).style.borderColor = ''
    //                 } else {
    //                     this.confirmPasswordElement.style.borderColor = 'red'
    //                 }
    //             }              
    //         }
           
    //     }
    //     this.validateForm()
    // }


    private validateForm(): boolean {
            const validForm = this.fields.every(item => item.valid);
        
            if (validForm) {
                if (this.processElement) {
                     this.processElement.removeAttribute('disabled')
                }
            } else {
                if (this.processElement) {
                    this.processElement.setAttribute('disabled', 'disabled')
                }
               
            }

            return validForm
    }

   private  async processForm(): Promise<void> {
        if (this.validateForm()) {
            try {
                if (this.page === 'sign-up') {
                    if (this.commonErrorSignUpElement) {
                        this.commonErrorSignUpElement.style.display = 'none';
                    }
                   

                    let result: HttpUtilsResultType<SignUpResponseType> = await HttpUtils.request('/signup', 'POST', false, {
                        name: (this.nameElement as HTMLInputElement).value,
                        lastName: (this.lastNameElement as HTMLInputElement).value,
                        email: (this.emailElement as HTMLInputElement).value,
                        password: (this.passwordElement as HTMLInputElement).value,
                        passwordRepeat: (this.passwordElement as HTMLInputElement).value,

                    } )
                    const response: DefaultErrorResponseType |SignUpResponseType | null = result.response;
                    if (result.error || !response || (response && !(response as SignUpResponseType).user)) {
                        if (this.commonErrorSignUpElement) {
                            this.commonErrorSignUpElement.style.display = 'block';
                        }
                      
                        throw new Error('SignUp failed');
                    }
                    if (result.response)  {
                        AuthUtils.setAuthInfo('', '', {
                       
                            name: result.response.user.name,
                            email: (this.emailElement as HTMLInputElement).value,
                            lastName: result.response.user.lastName,
                            id: result.response.user.id
                        })
                    }
                  

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

                const result: HttpUtilsResultType<LoginResponseType> = await HttpUtils.request('/login', 'POST', false, {
                    email: (this.emailElement as HTMLInputElement).value,
                    password: (this.passwordElement as HTMLInputElement).value,
                    rememberMe: (this.rememberMeElement as HTMLInputElement ).checked
                })

                const response: DefaultErrorResponseType | LoginResponseType | null = result.response;
                    if (result.error || !response || (response && !(response as LoginResponseType).user)) {
                        if (this.commonErrorSignUpElement) {
                            this.commonErrorSignUpElement.style.display = 'block';
                        }
                      
                        throw new Error('Login failed');
                    }

                    if (result.response) {
                        AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {
                            name: result.response.user.name,
                            lastName: result.response.user.lastName,
                            id: result.response.user.id
                        })
                    }
               



                this.openNewRoute('/')

            } catch (error) {
                return console.log(error)
            }





        }


    }


}