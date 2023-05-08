import { PoolConnection } from "mysql2/promise";
import { PaymentController, PAYMENT_TYPE } from "./paymentController";

// 제품 판매 함수
async function payProductPrice(vmID: number, priceSum: number, paymentMethod: number, inputMoney: number, connection: PoolConnection): Promise<boolean> {
    let isOkay: boolean = true;
    const paymentController = new PaymentController();

    if (isNaN(paymentMethod) || paymentMethod < 1 || paymentMethod > 2) {
        console.log("지불 방법이 올바르지 않습니다.");
        isOkay = false;
    } else {
        let paymentType: PAYMENT_TYPE = undefined!;
        switch (paymentMethod) {
            case 1:
                paymentType = "cash";
                break;
            case 2:
                paymentType = "card";
                break;
            default:
                throw new Error('unsupported payment type');
        }
        if (!await paymentController.pay(paymentType, vmID, priceSum, inputMoney, connection)) {
            console.log("결제에 실패했습니다.");
            isOkay = false;
        }
    }
    return isOkay;
};

export { payProductPrice };

