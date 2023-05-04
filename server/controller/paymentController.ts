import { checkLeftChange } from "./../models/ResourceModel";
import { leftVMMoneyAfterPayment } from '../models/OrderModel';

interface IPaymentService {
    pay(vmID: number, priceSum: number, inputMoney: number): Promise<boolean>;
}

class CashPaymentService implements IPaymentService {
    pay(vmID: number, priceSum: number, inputMoney: number): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            const price: number = inputMoney;
            let leftVMMoney: number = await checkLeftChange(vmID); // 자판기 잔액

            if (isNaN(price) || price < priceSum) {
                console.log("지불 금액이 부족하거나 올바르지 않습니다.");
                resolve(false);
            }
            else {
                const returnChange = price - priceSum;  // 반환 금액 = 입금액 - 상품 총합

                // 정상적 현금 결제
                if (leftVMMoney - returnChange >= 0 && returnChange >= 0) {
                    console.log(`현금 결제 : ${priceSum}원입니다. `);
                    console.log(`반환 금액 : ${returnChange}원입니다. `);
                    if (await leftVMMoneyAfterPayment(vmID, leftVMMoney, returnChange)) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
                // 비정상적 현금 결제 
                else {
                    console.log(`기기 내 잔액 부족으로 반환 불가로 이용할 수 없습니다.`);
                    console.log(`[판매] - 기기 내 잔액 : ${leftVMMoney}`);
                    resolve(false);
                }
            }
        });
    }
}

class CardPaymentService implements IPaymentService {
    pay(vmID: number, priceSum: number, inputMoney: number): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            let leftCardMoney = inputMoney - priceSum;
            console.log(`카드 결제 : ${priceSum}원입니다. `);
            console.log('결제 중 입니다...');

            if (leftCardMoney >= 0) { // 카드 결제 성공
                setTimeout(() => {
                    console.log("[판매] 카드 결제를 완료하였습니다. ");
                    resolve(true);
                }, 2000);
            } else { // 카드 결제 실패
                setTimeout(() => {
                    console.log("[판매] 카드 결제를 실패하였습니다. ");
                    resolve(false);
                }, 2000);
            }
        });
    }
}

class CoinPaymentService implements IPaymentService {
    pay(vmID: number, priceSum: number): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
}

export type PAYMENT_TYPE = "card" | "cash" | "coin";

export class PaymentController {
    supportPayments = {
        "card": new CardPaymentService(),
        "cash": new CashPaymentService(),
        "coin": new CoinPaymentService(),
    };
    pay(paymentType: PAYMENT_TYPE, vmID: number, priceSum: number, inputMoney: number): Promise<boolean> {
        return this.supportPayments[paymentType].pay(vmID, priceSum, inputMoney);
    }
}
