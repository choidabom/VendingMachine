import { db } from "../db/db";
import { PoolConnection } from "mysql2/promise";

// 자판기 내 잔돈(leftChange) 반환 - vm_resource에 cash도 포함
async function checkLeftChange(vmID: number, connection: PoolConnection): Promise<number> {
    const leftChange = `
        SELECT quantity FROM vm_resource
        WHERE vm_id = ${vmID} AND name = 'cash'
    `;
    const [leftChangeResult, _] = await db.query(connection, leftChange);
    return leftChangeResult[0].quantity;
}


// 자판기 재료 감소 확인용
async function checkLeftResource(vmID: number, connection: PoolConnection) {
    const checkResult = `
        SELECT resource_id, quantity FROM vm_resource WHERE vm_id = ${vmID}
    `;
    return await db.query(connection, checkResult);
}


// 재료 차감 함수
async function deductQuantity(vmID: number, resourceID: number, leftResource: number, connection: PoolConnection) {
    const deductQuantitySQL = `
        UPDATE vm_resource
        SET quantity = ${leftResource}
        WHERE vm_id = ${vmID} AND resource_id = ${resourceID};
    `;
    const quantityResult = await db.query(connection, deductQuantitySQL);
    if (!quantityResult) {
        throw new Error("해당 상품을 차감할 수 없습니다.");
    }
}


export { checkLeftChange, checkLeftResource, deductQuantity };