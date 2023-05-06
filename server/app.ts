import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { VendingMachineServer } from "./VendingMachineServer";
import { ProductEntity } from "./entity/ProductEntity";
import { checkLeftResource } from "./models/ResourceModel";
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
        const getProducts = await vm.getProductsList(selectedIDs);
        if (await vm.checkResource(vmID, getProducts)) { // 재고 여유가 있는 경우
            res.status(200).json(getProducts);
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
    const selectedProducts: Array<ProductEntity> = req.body.selectedProducts;
    const paymentMethod: number = req.body.paymentMethod;
    const inputMoney: number = req.body.inputMoney;

    try {
        const totalPrice = await priceSum(selectedProducts); // 상품 총합
        // 아래 필요한 로직들에서 취소 또는 에러가 났을 경우, rollback을 하게끔 구현해야한다. 
        // 주문 정보 DB 생성 - 생성 여부에 따라 가격 결제 여부 판단
        if (await addingOrder(vmID, selectedProducts, paymentMethod)) {

            // 가격 결제 로직 
            if (await payProductPrice(vmID, totalPrice, paymentMethod, inputMoney)) {
                if (await vm.checkReduceResource(vmID, selectedProducts)) {
                    console.log('Vending Machine 내 남은 자원 양: ', await checkLeftResource(vmID));
                    res.status(200).send(`성공적으로 ${totalPrice}원이 결제되었습니다. ${inputMoney - totalPrice}원을 반환합니다.`);
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

