// export class Login {
//     constructor(openNewRote) {
//         this.openNewRote = openNewRote
//         this.emailElement = document.getElementById('email');
//         this.passwordElement = document.getElementById('password');
//         this.emailErrorElement = document.getElementById('email-error')
//         this.passwordErrorElement = document.getElementById('password-error')
//         this.rememberMeElement = document.getElementById('flexCheckDefault')
//         this.processElement = document.getElementById('process-button')
//         this.commonErrorElement = document.getElementsByClassName('common-error')[0]
//
//
//         this.fields = [
//             {
//                 name: 'email',
//                 id: 'email',
//                 element: null,
//                 regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//                 valid: false,
//             },
//             {
//                 name: 'password',
//                 id: 'password',
//                 element: null,
//                 regex: '',
//                 valid: false,
//             },
//
//         ]
//
//         const that = this;
//         this.fields.forEach(item => {
//             item.element = document.getElementById(item.id);
//             item.element.onchange = function () {
//                 that.validateField.call(that, item, this);
//             }
//         });
//
//
//         this.processElement.addEventListener('click', this.login.bind(this))
//
//     }
//
//
//     validateField(field, element) {
//         if (!element.value || !element.value.match(field.regex)) {
//             element.style.borderColor = 'red';
//             this.emailErrorElement.style.display = 'block'
//             this.passwordErrorElement.style.display = 'block'
//
//             field.valid = false;
//         } else {
//             element.style.borderColor = 'green';
//             this.emailErrorElement.style.display = 'none'
//             this.passwordErrorElement.style.display = 'none'
//
//             field.valid = true;
//         }
//         this.validateForm()
//     }
//
//
//     validateForm() {
//         const validForm = this.fields.every(item => item.valid);
//         if (validForm) {
//             this.processElement.removeAttribute('disabled')
//         } else {
//             this.processElement.setAttribute('disabled', 'disabled')
//         }
//         return validForm
//     }
//
//     async login() {
//         this.commonErrorElement.style.display = 'none'
//         if (this.validateForm()) {
//
//         }
//     }
// }

