import { rl } from "./input/readlineInput";
import { transaction } from "./db/db";
import { ProductEntity } from './entity/ProductEntity';
import { ResourceEntity } from "./entity/ResourceEntity";
import { VMResourceEntity } from './entity/VMResourceEntity';
// import { PAYMENT_TYPE, PaymentController } from "./controller/paymentController";

// 자판기 클래스 정의
export class VendingMachine {

    // 생성자에서 프로퍼티 초기화
    constructor() {
    }

    // 자판기 초기화 
    async initializeVendingMachine(vmID: number, location: string): Promise<boolean> {
        // 1. vending machine의 존재여부 판단
        if (!await this.checkingID(vmID)) {
            this.insertVendingMachine(vmID, location);
        }

        // 2. default resource의 목록을 조회하면서, vm_resource에 없는 resource 추가
        const checkingExist = `
            INSERT INTO vm_resource (vm_id, resource_id, name, quantity)
            SELECT ${vmID}, resource_id, name, quantity FROM default_resource
            WHERE NOT EXISTS (SELECT * FROM vm_resource
            WHERE vm_id = ${vmID} AND resource_id = default_resource.resource_id)
        `;
        await transaction(checkingExist);
        console.log(`[자판기 [${vmID}]에 기본 자원이 충전되었습니다.]`);

        return true;
    };


    // 자판기 존재 여부
    async checkingID(vmID: number): Promise<number> {
        const checkVM = `
        SELECT * FROM vending_machine WHERE id=${vmID}
        `;
        const checkingIDResult = await transaction(checkVM);
        return checkingIDResult.length;
    };


    // 자판기 객체 DB 추가 
    async insertVendingMachine(vmID: number, location: string) {
        const insertingVM = `
            INSERT INTO vending_machine (id, location)
            VALUES (${vmID}, "${location}")
        `;
        await transaction(insertingVM);
    };

    // ------------------------------------------------------------

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
        const accumulateResource: Array<ResourceEntity> = [];

        // 1. 누적 자원 필요 수량
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

        // 2. vm 내 자원 수량
        const vmResourceSQL = `
            SELECT resource_id, quantity FROM vm_resource WHERE vm_id = ${vmID} 
        `;
        const vmResource = await transaction(vmResourceSQL);

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

    // ------------------------------------------------------------

    // 제품 선택 함수 (화면 상에서 노출)
    async selectProducts(): Promise<number[]> {
        let selected: Array<number> = [];
        // return new Promise<boolean>((resolve, reject) => {
        rl.question(
            "구매할 음료 번호를 입력하세요(취소: 0, 여러 개 선택: 예) 1, 2, 3) :  ",
            (answer: string) => {
                try {
                    const selectedNum = answer.split(",").filter(e => { Number.isInteger(parseInt(e)); }).map((e) => parseInt(e));
                    if (selectedNum.includes(0)) {
                        console.log('취소되었습니다.');
                        // resolve(false);
                    } else {
                        selected = selectedNum;
                    }
                } catch (error) {
                    console.log("잘못된 입력입니다. 다시 입력해주세요.");
                    // resolve(await this.selectProducts());
                }

            }
        );
        // });
        return selected;
    }

    // 선택된 제품 반환 함수
    async getProductList(vmID: number, selectedNum: Array<number>): Promise<Array<ProductEntity>> {
        let products: Array<ProductEntity> = [];
        for (let num of selectedNum) {
            const getProductSQL = `
                SELECT * FROM product WHERE vm_id = ${vmID} AND id = ${num}
            `;
            const product = await transaction(getProductSQL);
            products.push(product[0]);
        }
        return products;
    };

    // 제품 구매 정보 화면 출력 함수
    async showPurchaseList(products: Array<ProductEntity>) {
        let total = 0;
        for (let product of products) {
            console.log(`${product.name}: ${product.price}원 `);
            total += product.price;
        }

        console.log(`총 가격: ${total}원`);
    };

    // ------------------------------------------------------------


    // 제품 판매 함수 (내부적으로 처리)
    // private async sellProducts(vmID: number, selectedProduct: Array<ProductEntity>, priceSum: number) {
    //     const paymentService = new PaymentController();

    //     return new Promise((resolve, reject) => {
    //         rl.question("지불 방법을 선택하세요 (1: 현금, 2: 카드) : ",
    //             async (answer: string) => {
    //                 const paymentMethod = parseInt(answer);
    //                 if (isNaN(paymentMethod) || paymentMethod < 1 || paymentMethod > 2) {
    //                     console.log("지불 방법을 다시 입력해주세요.");
    //                     const result = this.sellProducts(vmID, selectedProduct, priceSum);
    //                     resolve(result);
    //                 } else {
    //                     let paymentType: PAYMENT_TYPE = undefined!;
    //                     switch (paymentMethod) {
    //                         case 1:
    //                             paymentType = "cash";
    //                             break;
    //                         case 2:
    //                             paymentType = "card";
    //                         default:
    //                             throw new Error('unsupported payment type');
    //                         //
    //                     }

    //                     const complete = await paymentService.pay(paymentType, vmID, priceSum);
    //                     if (complete) {
    //                         // 주문 정보 저장 (orders 테이블) 
    //                         for (let product of selectedProduct) {
    //                             const saveOrder = `
    //                                 INSERT INTO orders (vm_id, product_id, payment_id)
    //                                 VALUES (${vmID}, ${product.id}, ${paymentMethod});
    //                               `;
    //                             await transaction(saveOrder);
    //                         }
    //                         // await this.deductResource(selectedProduct);
    //                     } else {
    //                         console.log("자판기 이용을 종료합니다. ");
    //                         rl.close();
    //                     }
    //                 }
    //             });
    //     });
    // };

    // 재료 차감 함수 (내부적으로 처리)
    // async deductResource(selectedProduct: Array<ProductEntity>) {
    //     // 상품별 재고 차감
    //     for (let product of selectedProduct) {
    //         if (await this.checkProductStock(product)) {
    //             // 선택된 상품이 필요로 하는 resource_id 출력
    //             const productResource = `
    //                 SELECT resource_id FROM product_resource 
    //                 WHERE product_id = ${product.id}
    //                 `;
    //             const [productResourceResult, _] = await _DBConnection.query(productResource);


    //             for (let resource of productResourceResult) {
    //                 const amount = `
    //                     SELECT amount FROM product_resource
    //                     WHERE product_id = ${product.id} AND resource_id = ${resource.resource_id}
    //                 `;
    //                 const [amountResult, _] = await _DBConnection.query(amount);

    //                 // 전체 재고에서 사용되는 양만큼 재고 차감
    //                 const deductQuantity = `
    //                     UPDATE vm_resource
    //                     SET quantity = quantity - ${amountResult[0].amount}
    //                     WHERE vm_id = ${this.id} AND resource_id = ${resource.resource_id};
    //                 `;
    //                 await _DBConnection.query(deductQuantity);
    //             }
    //         } else {
    //             console.log("판매가 불가합니다. 죄송합니다.");
    //             break;
    //         }
    //     }
    //     console.log("[판매] 재료를 차감하였습니다.");
    //     console.log(this.vmResources);
    // }
}
const vm = new VendingMachine();