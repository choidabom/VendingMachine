import { PAYMENT_TYPE } from "../controller/paymentController";
import { transaction } from "../db/db";
import { ProductEntity } from "../entity/ProductEntity";

// 상품 총합 (OrderModel.ts에 없어도 되긴함. DB 사용 X)
async function priceSum(selectedProduct: Array<ProductEntity>): Promise<number> {
    let priceSum: number = 0;
    for (let product of selectedProduct) {
        priceSum += product.price;
    }
    return priceSum;
}

// 주문 정보 DB 생성
async function addingOrder(vmID: number, products: Array<ProductEntity>, paymentMethod: number): Promise<boolean> {
    let isOkay: boolean = true;
    try {
        for (let product of products) {
            const saveOrder = `
                INSERT INTO orders (vm_id, product_id, payment_id)
                VALUES (${vmID}, ${product.id}, ${paymentMethod});
            `;
            await transaction(saveOrder);
        }
    } catch (error) {
        console.error('Failed to add order in DB.');
        isOkay = false;
    }
    return isOkay;
}

// 결제 후, 잔액 DB(vm_resource 테이블)에 저장 
async function leftVMMoneyAfterPayment(vmID: number, leftVMMoney: number, returnChange: number): Promise<boolean> {
    let isOkay: boolean = true;
    try {
        const leftChange = leftVMMoney - returnChange;
        const leftChangeSQL = `
            UPDATE vm_resource
            SET quantity = ${leftChange}
            WHERE vm_id = ${vmID} AND name = 'cash'
        `;
        await transaction(leftChangeSQL);
    } catch {
        console.error('Failed to update left money in VM.');
        isOkay = false;
    }
    return isOkay;
}

export { priceSum, addingOrder, leftVMMoneyAfterPayment };