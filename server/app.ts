import cors from "cors";
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { ProductEntity } from "./entity/ProductEntity";
import { VendingMachineServer } from "./VendingMachineServer";
import processOrderTransaction from "./controller/processOrderTransaction";

const app = express();
const PORT: number = 3000;
app.use(cors());
app.use(bodyParser.json());
const vm = new VendingMachineServer();

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server started. Listen on port ${PORT}`);
});


// 자판기 가동 API
app.get('/vending_machine/:vmID', async (req: Request, res: Response) => {
    const vmID = parseInt(req.params.vmID.replace(/\D/g, ''), 10);
    if (!vmID) {
        throw new Error('Invalid request body');
    }
    try {
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
    const vmID = parseInt(req.params.vmID.replace(/\D/g, ''), 10);
    try {
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
app.post('/vending_machine/:vmID/product/select', async (req: Request, res: Response) => {
    const vmID = parseInt(req.params.vmID.replace(/\D/g, ''), 10);
    const selectedIDs: Array<number> = req.body.selectedIDs;
    try {
        const getProducts: Array<ProductEntity> = await vm.getProductsList(selectedIDs);
        if (await vm.checkResource(vmID, getProducts)) { // 재고 여유가 있는 경우
            res.status(200).json(getProducts);
        } else { // 재고 여유가 없는 경우 
            res.status(500).send('Selected is not working or Resource is not enough.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" }); // 500: Internal Server Error
    }
});


// 가격 결제 API
app.post('/vending_machine/:vmID/order', async (req: Request, res: Response) => {
    const vmID: number = parseInt(req.params.vmID.replace(/\D/g, ''), 10);
    const selectedProducts: Array<ProductEntity> = req.body.selectedProducts;
    const paymentMethod: number = req.body.paymentMethod;
    const inputMoney: number = req.body.inputMoney;

    try {
        // result = inputMoney - totalPrice = 반환금
        const result = await processOrderTransaction(vmID, selectedProducts, paymentMethod, inputMoney);
        res.status(200).send(`${result}`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Failed to pay for product.');
    }
}
);

