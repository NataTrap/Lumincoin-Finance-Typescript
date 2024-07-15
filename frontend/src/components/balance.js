// import {HttpUtils} from "../utils/http-utils";
//
// export class Balance {
//     constructor(openNewRoute) {
//         this.openNewRoute = openNewRoute;
//         this.getBalance().then()
//     }
//     async getBalance() {
//         const result = await HttpUtils.request('/balance')
//         if (result.redirect) {
//             return this.openNewRoute(result.redirect);
//         }
//         if (result.error || !result.response || (result.response && result.response.error)) {
//             console.log(result.response.message)
//             return alert('Возникла ошибка при запросе Баланса. Обратитесь в поддержку ')
//         }
//         this.showBalance(result.response)
//     }
//
//     showBalance(result) {
//         let balanceElement =  document.getElementById('balance')
//         balanceElement.innerText = result.balance
//
//     }
// }