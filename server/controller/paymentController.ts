// import { ProductEntity } from '../entity/ProductEntity';
// import { checkLeftChange } from "./../models/models";
// import { db, transaction } from "../db/db";

// interface IPaymentService {
//     pay(vmID: number, priceSum: number, inputMoney: number): Promise<boolean>;
// }

// class CashPaymentService implements IPaymentService {
//     pay(vmID: number, priceSum: number, inputMoney: number): Promise<boolean> {
//         return new Promise<boolean>(async (resolve, reject) => {
//             const price = inputMoney;
//             let leftMoney = await checkLeftChange(vmID);

//             if (isNaN(price) || price < priceSum) {
//                 console.log("지불 금액이 부족하거나 올바르지 않습니다. 다시 입력해주세요.");
//                 resolve(false);
//             }
//             else {
//                 const change = price - priceSum;  // 반환 금액 = 입금액 - 상품 총합

//                 // 정상적 현금 결제
//                 if (leftMoney - change >= 0 && change >= 0) {
//                     console.log(`현금 결제 : ${priceSum}원입니다. `);
//                     console.log(`반환 금액 : ${change}원입니다. `);

//                     // 결제 잔액 DB(vm_resource 테이블)에 저장 
//                     const leftChange = leftMoney - change;
//                     const leftChangeSQL = `
//                             UPDATE vm_resource
//                             SET quantity = ${leftChange}
//                             WHERE vm_id = ${vmID} AND name = 'cash'
//                     `;
//                     await transaction(leftChangeSQL);
//                     resolve(true);
//                 }
//                 // 비정상적 현금 결제 
//                 else {
//                     console.log(`기기 내 잔액 부족으로 반환 불가로 이용할 수 없습니다.`);
//                     console.log(`[판매] - 기기 내 잔액 : ${leftMoney}`);
//                     resolve(false);
//                 }
//             }
//         });
//     }
// }

// class CardPaymentService implements IPaymentService {
//     pay(vmID: number, priceSum: number, inputMoney: number): Promise<boolean> {
//         // 카드 결제는 일단 always true로 설정
//         const isAvailable = true;

//         return new Promise((resolve, reject) => {
//             console.log(`카드 결제 : ${priceSum}원입니다. `);
//             console.log('결제 중 입니다...');
//             if (isAvailable) { // 카드 결제 성공
//                 setTimeout(() => {
//                     console.log("[판매] 카드 결제를 완료하였습니다. ");
//                     resolve(true);
//                 }, 2000);
//             } else { // 카드 결제 실패
//                 setTimeout(() => {
//                     console.log("[판매] 카드 결제를 실패하였습니다. ");
//                     resolve(false);
//                 }, 2000);
//             }
//         });
//     }
// }

// class CoinPaymentService implements IPaymentService {
//     pay(vmID: number, priceSum: number): Promise<boolean> {
//         throw new Error('Method not implemented.');
//     }
// }

// export type PAYMENT_TYPE = "card" | "cash" | "coin";

// export class PaymentController {
//     supportPayments = {
//         "card": new CardPaymentService(),
//         "cash": new CashPaymentService(),
//         "coin": new CoinPaymentService(),
//     };
//     pay(paymentType: PAYMENT_TYPE, vmID: number, priceSum: number, inputMoney: number): Promise<boolean> {
//         return this.supportPayments[paymentType].pay(vmID, priceSum, inputMoney);
//     }
// }
