import { db } from "../db/db";
import { ProductEntity } from "../entity/ProductEntity";
import { PoolConnection } from "mysql2/promise";

// 상품 총합 (OrderModel.ts에 없어도 되긴함. DB 사용 X)
async function priceSum(selectedProduct: Array<ProductEntity>): Promise<number> {
    let priceSum: number = 0;
    for (let product of selectedProduct) {
        priceSum += product.price;
    }
    return priceSum;
}


// 주문 정보 DB 생성
async function addingOrder(vmID: number, products: Array<ProductEntity>, paymentMethod: number, connection: PoolConnection): Promise<boolean> {
    let isOkay: boolean = true;
    try {
        for (let product of products) {
            const saveOrder = `
                INSERT INTO orders (vm_id, product_id, payment_id)
                VALUES (${vmID}, ${product.id}, ${paymentMethod});
            `;
            await db.query(connection, saveOrder);
        }
    } catch (error) {
        console.error('Failed to add order in DB.');
        isOkay = false;
    }
    return isOkay;
}


// 결제 후, 잔액 DB(vm_resource 테이블)에 저장 
async function leftVMMoneyAfterPayment(vmID: number, leftVMMoney: number, returnChange: number, connection: PoolConnection): Promise<boolean> {
    let isOkay: boolean = true;
    try {
        const leftChange = leftVMMoney - returnChange;
        const leftChangeSQL = `
            UPDATE vm_resource
            SET quantity = ${leftChange}
            WHERE vm_id = ${vmID} AND name = 'cash'
        `;
        await db.query(connection, leftChangeSQL);
    } catch {
        console.error('Failed to update left money in VM.');
        isOkay = false;
    }
    return isOkay;
}

export { priceSum, addingOrder, leftVMMoneyAfterPayment };