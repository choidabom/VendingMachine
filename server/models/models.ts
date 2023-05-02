// before adding VendingMachine.ts


// import { db, transaction } from "../db/db";
// import { ProductEntity } from "./../entity/ProductEntity";
// import { ResourceEntity } from "./../entity/ResourceEntity";

// // 자판기 내 잔돈(leftChange) 반환
// async function checkLeftChange(vmID: number): Promise<number> {
//     const leftChange = `
//         SELECT quantity FROM vm_resource
//         WHERE vm_id = ${vmID} AND name = 'cash'
//     `;
//     const leftChangeResult = await transaction(leftChange);
//     return leftChangeResult[0].quantity;
// }


// // 자판기 존재 여부
// async function checkingID(vmID: number): Promise<number> {
//     const checkVM = `
//         SELECT * FROM vending_machine WHERE id=${vmID}
//         `;
//     const checkingIDResult = await transaction(checkVM);
//     return checkingIDResult.length;
// };


// // 자판기 객체 DB 추가 
// async function insertVendingMachine(vmID: number, location: string) {
//     const insertingVM = `
//         INSERT INTO vending_machine (id, location)
//         VALUES (${vmID}, "${location}")
//     `;
//     await transaction(insertingVM);
// };


// // 자판기 초기화 
// async function initializeVendingMachine(vmID: number, location: string): Promise<boolean> {
//     // 1. vending machine의 존재여부 판단
//     if (!await checkingID(vmID)) {
//         insertVendingMachine(vmID, location);
//     }

//     // 2. default resource의 목록을 조회하면서, vm_resource에 없는 resource 추가
//     const checkingExist = `
//         INSERT INTO vm_resource (vm_id, resource_id, name, quantity)
//         SELECT ${vmID}, resource_id, name, quantity FROM default_resource
//         WHERE NOT EXISTS (SELECT * FROM vm_resource
//         WHERE vm_id = ${vmID} AND resource_id = default_resource.resource_id)
//     `;
//     await transaction(checkingExist);

//     return true;
// };


// // 제품 ID로 제품 확인
// async function getProductById(productID: number): Promise<ProductEntity> {
//     const products = `
//         SELECT * FROM product WHERE id = ${productID}
//     `;
//     const product = await transaction(products);

//     if (!product) {
//         throw new Error("해당 상품을 찾을 수 없습니다.");
//     }
//     return product[0];
// }


// // 상품 재고 필요 수량(amount) 확인 - 단품
// async function checkProductStock(vmID: number, product: ProductEntity): Promise<boolean> {
//     let isAvailable = true;
//     const checkResource = `
//         SELECT vr.resource_id, pr.amount, vr.quantity
//         FROM product_resource AS pr
//         JOIN vm_resource AS vr
//         ON pr.resource_id = vr.resource_id
//         WHERE vr.vm_id = ${vmID} AND pr.product_id = ${product.id}
//     `;
//     const resourceResult = await transaction(checkResource);

//     // 객체 내 needResource에 재고 필요 수량(amount) 누적
//     for (let resource of resourceResult) {
//         // 먼저, product에서 필요로 하는 resource 체크
//         if (resource.quantity < resource.amount) {
//             console.log(`${product}의 ${resource} 재료가 부족합니다.`);
//             isAvailable = false;
//             break;
//         }
//     }
//     return isAvailable;
// };


// // 상품 재고 필요 수량(amount) 확인 - 다수
// async function checkProductsStock(vmID: number, products: Array<ProductEntity>): Promise<boolean> {
//     let isAvailable = true;
//     const accumulateResource: Array<ResourceEntity> = [];

//     for (let product of products) {

//         // 각 상품별 필요 재고 수량(amount)
//         const checkResource = `
//             SELECT vr.resource_id, vr.quantity, pr.amount
//             FROM product_resource AS pr
//             JOIN vm_resource AS vr
//             ON pr.resource_id = vr.resource_id
//             WHERE vr.vm_id = ${vmID} AND pr.product_id = ${product.id}
//         `;
//         const resourceResult = await transaction(checkResource);

//         // 자판기 내 재고 필요 수량(amount) 누적
//         for (let resource of resourceResult) {
//             // 누적 처리
//             const idx = accumulateResource.findIndex((r) => r.resource_id === resource.resource_id);
//             if (idx < 0) {
//                 accumulateResource.push({ resource_id: resource.resource_id, amount: resource.amount });
//             } else {
//                 accumulateResource[idx].amount += resource.amount;
//             }
//         }
//     }

//     if (!isAvailableResource(vmID, accumulateResource)) {
//         isAvailable = false;
//     }
//     return isAvailable;
// };


// // 자판기 내 resource 양(vmResource)과 누적 재고 필요 수량(accumulateResource) 비교
// async function isAvailableResource(vmID: number, accumulateResource: Array<ResourceEntity>): Promise<boolean> {
//     let isAvailable = true;
//     const vmResourceSQL = ` 
//         SELECT resource_id, quantity FROM vm_resource WHERE vm_id = ${vmID} 
//     `;
//     const vmResource = await transaction(vmResourceSQL);
//     for (let i = 0; i < accumulateResource.length; i++) {
//         if (vmResource[i].quantity < accumulateResource[i].amount) {
//             isAvailable = false;
//             break;
//         }
//     }
//     return isAvailable;
// }


// // 자판기 판매 가능 상품 (재고 확인 완료) 함수 
// async function showProducts(vmID: number) {
//     const productsSQL = `
//         SELECT * FROM product
//     `;
//     const products = await transaction(productsSQL);

//     if (await checkProductsStock(vmID, products)) {
//     } else {
//         console.log(`It's not available for sale.`);
//     }
// }


// // 재료 차감 함수
// async function deductResource(vmID: number, selectedProduct: Array<ProductEntity>) {
//     // 상품별 재고 차감
//     for (let product of selectedProduct) {
//         if (await checkProductStock(vmID, product)) {
//             // 선택된 상품이 필요로 하는 resource_id 출력
//             const productResource = `
//                 SELECT resource_id FROM product_resource 
//                 WHERE product_id = ${product.id}
//                 `;
//             const productResourceResult = await transaction(productResource);

//             for (let resource of productResourceResult) {
//                 const amount = `
//                     SELECT amount FROM product_resource
//                     WHERE product_id = ${product.id} AND resource_id = ${resource.resource_id}
//                 `;
//                 const amountResult = await transaction(amount);

//                 // 전체 재고에서 사용되는 양만큼 재고 차감
//                 const deductQuantity = `
//                     UPDATE vm_resource
//                     SET quantity = quantity - ${amountResult[0].amount}
//                     WHERE vm_id = ${vmID} AND resource_id = ${resource.resource_id};
//                 `;
//                 await transaction(deductQuantity);
//             }
//         } else {
//             console.log("판매가 불가합니다. 죄송합니다.");
//             break;
//         }
//     }
//     console.log("[판매] 재료를 차감하였습니다.");
// }


// // 재료 차감 함수
// async function reduceResource(vmID: number, accumulateResource: Array<ResourceEntity>) {
//     const vmResourceSQL = ` 
//         SELECT resource_id, quantity FROM vm_resource WHERE vm_id = ${vmID} 
//     `;
//     const vmResource = await transaction(vmResourceSQL);
//     console.log(vmResource);
//     for (let i = 0; i < accumulateResource.length; i++) {
//         // 전체 재고에서 사용되는 양만큼 재고 차감
//         const deductQuantity = `
//             UPDATE vm_resource
//             SET quantity = quantity - ${accumulateResource[i].amount}
//             WHERE vm_id = ${vmID} AND resource_id = ${vmResource[i].resource_id};
//         `;
//         const result = await transaction(deductQuantity);
//         if (!result) {
//             throw new Error("해당 상품을 차감할 수 없습니다.");
//         }
//     }
// };

// export { checkLeftChange, checkingID, initializeVendingMachine, insertVendingMachine, getProductById, checkProductStock, checkProductsStock, showProducts, deductResource, reduceResource };





