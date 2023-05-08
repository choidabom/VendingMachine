import { db } from "../db/db";
import { payProductPrice } from "./saleController";
import { ProductEntity } from "../entity/ProductEntity";
import { checkLeftResource } from "../models/ResourceModel";
import { addingOrder, priceSum } from "../models/OrderModel";
import { VendingMachineServer } from "../VendingMachineServer";

const vm = new VendingMachineServer();

const processOrderTransaction = async (vmID: number, products: Array<ProductEntity>, paymentMethod: number, inputMoney: number) => {
    const connection = await db.startTransaction();
    try {
        const totalPrice = await priceSum(products); // 상품 총합

        // 1. 주문 정보 DB 생성
        if (await addingOrder(vmID, products, paymentMethod, connection)) {

            // 2. 가격 결제 로직
            if (await payProductPrice(vmID, totalPrice, paymentMethod, inputMoney, connection)) {
                // 3. 재료 차감 로직
                if (await vm.checkReduceResource(vmID, products, connection)) {
                    const leftResourceResult = await checkLeftResource(vmID, connection);
                    console.log('Vending Machine 내 남은 자원 양: ', leftResourceResult[0]);
                } else
                    return `Failed to reduce resource for vending machine ${vmID}`;
            } else
                return `Failed to pay for your purchase in vending machine ${vmID}`;
        } else
            return `Failed to add order in vending machine ${vmID}`;

        // 모든 작업이 성공적으로 완료됐으므로 트랜잭션을 커밋합니다.
        await db.commitTransaction(connection);
        return `성공적으로 ${totalPrice}원이 결제되었습니다. ${inputMoney - totalPrice}원을 반환합니다.`;
    } catch (err) {
        await db.rollbackTransaction(connection);
        console.log("Transaction rolled back due to error:", err);
    } finally {
        connection.release();
    }
};

export default processOrderTransaction;