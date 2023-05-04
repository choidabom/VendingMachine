import { ProductEntity } from "../entity/ProductEntity";

// 제품 구매 정보 화면 출력 함수
async function showSelectedProductList(products: Array<ProductEntity>) {
    let total = 0;
    for (let product of products) {
        console.log(`=== ${product.name}: ${product.price}원 ===`);
        total += product.price;
    }
    console.log(`=== 총 가격: ${total}원 ===`);
};

export { showSelectedProductList };