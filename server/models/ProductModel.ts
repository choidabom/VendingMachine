import { transaction } from "../db/db";
import { ResourceEntity } from '../entity/ResourceEntity';
import { VMResourceEntity } from './../entity/VMResourceEntity';
import { ProductEntity } from "../../client/entity/ProductEntity";

// DB 내 정의되어있는 기본 자원
async function baseProductFromDB() {
    const productsSQL = `
        SELECT * FROM product 
    `;
    const products = await transaction(productsSQL);
    return products;
}


// 필요 자원 수량 누적 
async function accumulatingProductResource(vmID: number, products: Array<ProductEntity>) {
    const accumulateResource: Array<ResourceEntity> = [];
    try {
        for (let product of products) {
            // 각 상품별 필요 재고 수량(amount)
            const checkResourceSQL = `
                SELECT vr.resource_id, vr.quantity, pr.amount
                FROM product_resource AS pr
                JOIN vm_resource AS vr
                ON pr.resource_id = vr.resource_id
                WHERE vr.vm_id = ${vmID} AND pr.product_id = ${product.id}
            `;
            const checkResource = await transaction(checkResourceSQL);

            // 자판기 내 재고 필요 수량(amount) 누적
            for (let resource of checkResource) {
                const idx = accumulateResource.findIndex((r) => r.resource_id === resource.resource_id);
                if (idx < 0) {
                    accumulateResource.push({ resource_id: resource.resource_id, amount: resource.amount });
                } else {
                    accumulateResource[idx].amount += resource.amount;
                }
            }
        }
        return accumulateResource;
    } catch (err) {
        console.error('Accumulating product resource is failed', err);
    }
}


// vm 내 총 자원 수량
async function checkingVMResource(vmID: number) {
    try {
        const vmResourceSQL = `
            SELECT resource_id, quantity FROM vm_resource WHERE vm_id = ${vmID} 
        `;
        const vmResource: Array<VMResourceEntity> = await transaction(vmResourceSQL);
        return vmResource;
    } catch (err) {
        console.error('Checking Vending Machine Resource is failed', err);
    }
}

export { baseProductFromDB, accumulatingProductResource, checkingVMResource };

