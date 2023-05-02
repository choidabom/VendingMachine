// import { transaction } from "../db/db";
// import { ProductEntity } from "../entity/ProductEntity";


// async function orderSave(vmID: number, selectedProduct: Array<ProductEntity>, payment) {
//     // 주문 정보 저장 (orders 테이블) 
//     for (let product of selectedProduct) {
//         const saveOrder = `
//                 INSERT INTO orders (vm_id, product_id, payment_id)
//                 VALUES (${vmID}, ${product.id}, ${paymentMethod});
//                 `;
//         await transaction(saveOrder);
//     }
//     await this.deductResource(selectedProduct);

// }

// export default orderSave;