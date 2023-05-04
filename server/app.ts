import bodyParser from "body-parser";
import { transaction } from "./db/db";
import express, { Request, Response } from "express";
import { VendingMachineServer } from "./VendingMachineServer";
import { ProductEntity } from "./entity/ProductEntity";
import { addingOrder, priceSum } from "./models/OrderModel";
import { payProductPrice } from "./controller/saleController";

const app = express();
const PORT: number = 3000;
app.use(bodyParser.json());

const vm = new VendingMachineServer();

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server started. Listen on port ${PORT}`);
});

// 자판기 가동 API
app.get('/vending_machine/:vmID', async (req: Request, res: Response) => {
    try {
        const vmID = parseInt(req.params.vmID.replace(/\D/g, ''), 10);
        if (!vmID) {
            throw new Error('Invalid request body');
        }
        const completeInit = await vm.initializeVendingMachine(vmID);
        if (completeInit) {
            res.status(200).send(`Vending machine [${vmID}] reset completed`);
        } else {
            res.status(500).send(`This vending machine can't available.`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to start vending machine.');
    }
});


// 상품 조회 API 
app.get('/vending_machine/:vmID/product', async (req: Request, res: Response) => {
    try {
        const vmID = parseInt(req.params.vmID.replace(/\D/g, ''), 10);
        const products = await vm.getProductsByVendingMachineID(vmID); // 해당 자판기에 등록된 상품 목록을 조회하는 함수

        if (products) {
            res.status(200).json(products);
        } else {
            // 여기서 만약에 상품이 하나라도 안 되면 available 하지 않은 상태로 만들어버리기 때문에 고쳐야함 
            res.status(500).send('Some products are not available.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to check products.');
    }
});


// 상품 선택 API 
app.post('/vending_machine/:vmID/product/:productID', async (req: Request, res: Response) => {
    try {
        const vmID = parseInt(req.params.vmID.replace(/\D/g, ''), 10);
        const productID = parseInt(req.params.productID.replace(/\D/g, ''), 10);
        const getProduct = await vm.getProductList(productID);

        if (await vm.checkResource(vmID, getProduct)) { // 재고 여유가 있는 경우
            res.status(200).json(getProduct);
        } else { // 재고 여유가 없는 경우
            res.status(500).send('Selected is not working or Resource is not enough.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" }); // 500: Internal Server Error
    }
});


// 가격 결제 API
app.post('/vending_machine/:vmID/order', async (req: Request, res: Response) => {
    const vmID: number = parseInt(req.params.vmID.replace(/\D/g, ''), 10);
    const selectedProduct: Array<ProductEntity> = req.body.selectedProduct;
    const paymentMethod: number = req.body.paymentMethod;
    const inputMoney: number = req.body.inputMoney;

    try {
        const totalPrice = await priceSum(selectedProduct); // 상품 총합
        // 주문 정보 DB 생성 - 생성 여부에 따라 가격 결제 여부 판단
        if (await addingOrder(vmID, selectedProduct, paymentMethod)) {

            // 가격 결제 로직 
            if (await payProductPrice(vmID, totalPrice, paymentMethod, inputMoney)) {
                if (await vm.checkReduceResource(vmID, selectedProduct)) {
                    // 자판기 재료 감소 확인용
                    // const checkResult = `
                    //     SELECT quantity FROM vm_resource WHERE vm_id = ${vmID}
                    // `;
                    // const result = await transaction(checkResult);
                    // console.log(result);
                    res.status(200).send(`Successfully paid ${totalPrice} won for product.`);
                } else {
                    res.status(500).send('Failed to reduce resource');
                }
            } else {
                res.status(500).send('Failed payment ');
            }

        } else {
            res.status(500).send('Failed to add order.');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to pay for product.');
    }
}
);

