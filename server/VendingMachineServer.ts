import { queryTransaction } from "./db/db";
import { ResourceEntity } from './entity/ResourceEntity';
import { deductQuantity } from "./models/ResourceModel";
import { VMResourceEntity } from './entity/VMResourceEntity';
import { ProductEntity } from "../client/entity/ProductEntity";
import { checkingVMid, addingDefaultResource, insertVendingMachine } from "./models/VendingMachineModel";
import { accumulatingProductResource, baseProductFromDB, checkingVMResource } from "./models/ProductModel";
import { PoolConnection } from "mysql2/promise";

// 자판기 클래스 정의
export class VendingMachineServer {
    id?: number;
    // 생성자에서 프로퍼티 초기화
    constructor() {
    }

    // 자판기 초기화 
    async initializeVendingMachine(vmID: number): Promise<boolean> {
        try {
            // 1. vending machine의 존재여부 판단
            if (!await checkingVMid(vmID)) {
                insertVendingMachine(vmID);
            }
            // 2. default resource의 목록을 조회하면서, vm_resource에 없는 resource 추가
            addingDefaultResource(vmID);
            console.log(`The primary resource has been charged in Vending Machine [${vmID}].`);
            this.id = vmID;
            return true;
        } catch (err) {
            return false;
        }
    };


    // 자판기 ID를 파라미터로 받아 해당 자판기에 등록된 상품 목록 조회
    async getProductsByVendingMachineID(vmID: number) {
        let baseProducts: Array<ProductEntity> = await baseProductFromDB();
        if (await this.isAvailableProducts(vmID, baseProducts)) {
            return baseProducts;
        }
    }

    // 자판기 판매 가능 확인 함수 (기준 - 기본 제품 1개씩은 판매 가능)
    async isAvailableProducts(vmID: number, products: Array<ProductEntity>): Promise<boolean> {
        let isOkay = true;
        if (await this.checkResource(vmID, products)) {
            for (let product of products) {
                console.log(product);
            }
        } else {
            isOkay = false;
            console.log('판매가 불가능합니다.');
        }
        return isOkay;
    }


    // 누적 자원 필요 수량 정보와 vm내 자원 수량 정보 조회
    async checkResource(vmID: number, products: Array<ProductEntity>): Promise<boolean> {
        // 1. 누적 자원 필요 수량 정보
        const accumulateResource = await accumulatingProductResource(vmID, products);
        if (!accumulateResource) {
            throw new Error(`Failed to accumulate product resource for vending machine ${vmID}`);
        }

        // 2. vm 내 자원 수량 정보
        const vmResource = await checkingVMResource(vmID);
        if (!vmResource) {
            throw new Error(`Failed to get resource for vending machine ${vmID}`);
        }
        return this.isAvailableResource(vmID, accumulateResource, vmResource);
    };


    // 자판기 내 resource 양(vmResource)과 누적 재고 필요 수량(accumulateResource) 비교
    async isAvailableResource(vmID: number, accumulateResource: Array<ResourceEntity>, vmResource: Array<VMResourceEntity>): Promise<boolean> {
        let isAvailable = true;
        for (let i = 0; i < accumulateResource.length; i++) {
            if (vmResource[i].quantity < accumulateResource[i].amount) {
                isAvailable = false;
                break;
            }
        }
        return isAvailable;
    }

    // 선택된 제품 반환 함수 (하나의 제품만 가능하다는 가정하에)
    async getProductList(selectedNum: number): Promise<Array<ProductEntity>> {
        let products: Array<ProductEntity> = [];
        const getProductSQL = `
            SELECT * FROM product WHERE id = ${selectedNum}
        `;
        const product = await queryTransaction(getProductSQL);
        products.push(product[0]);
        return products;
    };


    // 선택된 제품 반환 함수 (여러 제품 가능)
    async getProductsList(selectedIDs: Array<number>): Promise<Array<ProductEntity>> {
        let products: Array<ProductEntity> = [];
        for (let id of selectedIDs) {
            const getProductSQL = `
                SELECT * FROM product WHERE id = ${id}
            `;
            const product = await queryTransaction(getProductSQL);
            products.push(product[0]);
        }
        return products;
    };


    // 누적 자원 필요 수량 정보와 vm내 자원 수량 정보 조회
    async checkReduceResource(vmID: number, products: Array<ProductEntity>, connection: PoolConnection): Promise<boolean> {
        // 1. 누적 자원 필요 수량 정보
        const accumulateResource = await accumulatingProductResource(vmID, products);
        if (!accumulateResource) {
            throw new Error(`Failed to accumulate product resource for vending machine ${vmID}`);
        }

        // 2. vm 내 자원 수량 정보
        const vmResource = await checkingVMResource(vmID);
        if (!vmResource) {
            throw new Error(`Failed to get resource for vending machine ${vmID}`);
        }
        return this.reduceResource(vmID, accumulateResource, vmResource, connection);
    };



    // 자판기 내 resource 양(vmResource)에서 누적 재고 필요 수량(accumulateResource) 차감
    async reduceResource(vmID: number, accumulateResource: Array<ResourceEntity>, vmResource: Array<VMResourceEntity>, connection: PoolConnection): Promise<boolean> {
        let isAvailable = true;
        for (let i = 0; i < accumulateResource.length; i++) {
            let resourceID = vmResource[i].resource_id;
            let leftResource = vmResource[i].quantity - accumulateResource[i].amount;
            if (leftResource >= 0) {
                await deductQuantity(vmID, resourceID, leftResource, connection);
                // console.log(`재료 ${vmResource[i].resource_id}: 자판기 내 resource 양 ${vmResource[i].quantity} - 재고 필요 수량 ${accumulateResource[i].amount} = 자판기 내 남은 재고 양 ${leftResource}`);
            } else {
                isAvailable = false;
                console.log(`resource [${vmResource[i].resource_id}]의 부족으로 판매할 수 없습니다.`);
            }
        }
        return isAvailable;
    }
}