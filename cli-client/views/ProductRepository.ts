import { ProductEntity } from "../entity/ProductEntity";

// 제품 구매 정보 화면 출력 함수
async function showSelectedProductTotal(products: any): Promise<number> {
    let total = 0;
    console.log(`====== 선택 상품 ======`);
    for (let product of products) {
        console.log(`${product.name}: ${product.price}원`);
        total += product.price;
    }
    console.log(`=== 총 합계: ${total}원 ===`);
    return total;
};

export { showSelectedProductTotal };