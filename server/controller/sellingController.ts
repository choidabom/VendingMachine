// import { PaymentController, PAYMENT_TYPE } from "./paymentController";

// // 제품 판매 함수
// async function payProductPrice(vmID: number, priceSum: number, paymentMethod: number, inputMoney: number) {
//     const paymentController = new PaymentController();
//     console.log(vmID, priceSum, paymentMethod);
//     if (isNaN(paymentMethod) || paymentMethod < 1 || paymentMethod > 2) {
//         console.log("지불 방법이 올바르지 않습니다.");

//     } else {
//         let paymentType: PAYMENT_TYPE = undefined!;
//         console.log('결제되었습니다.');
//         switch (paymentMethod) {
//             case 1:
//                 paymentType = "cash";
//                 break;
//             case 2:
//                 paymentType = "card";
//             default:
//                 throw new Error('unsupported payment type');
//         }

//         const complete = await paymentController.pay(paymentType, vmID, priceSum, inputMoney);
//         return complete;
//     }
// };

// export { payProductPrice };

