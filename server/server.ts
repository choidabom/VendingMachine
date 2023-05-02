import bodyParser from "body-parser";
import { transaction } from "./db/db";
import express, { Request, Response } from "express";
// import { payProductPrice } from "./controller/sellingController";
import { VendingMachine } from "./VendingMachine";
import { ProductEntity } from "./entity/ProductEntity";

const app = express();
const PORT: number = 3000;
app.use(bodyParser.json());

const vm = new VendingMachine();

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server started. Listen on port ${PORT}`);
});


// 자판기 가동 API (초기화)
app.get('/start', async (req: Request, res: Response) => {
    try {
        const { vmID, location } = req.body;
        if (!vmID || !location) {
            throw new Error('Invalid request body');
        }
        await vm.initializeVendingMachine(vmID, location);
        res.send('Vending machine reset completed');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to start vending machine.');
    }
});


// 상품 조회 API 
app.get('/product', async (req: Request, res: Response) => {
    try {
        const vmID = req.params.vmID;
        const productsSQL = `
            SELECT * FROM product
        `;
        const products: Array<ProductEntity> = await transaction(productsSQL);
        const isAvailable = await vm.isAvailableProducts(parseInt(vmID), products);
        if (isAvailable) {
            res.status(200).json(products);
        } else {
            res.status(500).send('Some products are not available.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to check products.');
    }
});


// 상품 선택 API 
app.post('/products/select', async (req: Request, res: Response) => {
    try {
        const products: Array<ProductEntity> = req.body.products;
        const selectedProduct = await vm.selectProducts();
        res.status(200).json({ selectedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" }); // 500: Internal Server Error
    }
});


// 재고 조회 API 
app.get("/inventory", async (req: Request, res: Response) => {
    try {
        const { vmID, product_id } = req.body;
        if (!vmID) {
            throw new Error('Invalid request body');
        }

        // if (!vm.isAvailableProducts(vmID, products)) {
        //     res.status(409).send(`These products is out of stock.`); // 409: bad request
        //     return;
        // }
        // res.send('Stock is available ');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to check inventory');
    }
});


// 상품 구매 API
// app.post('/purchase', async (req: Request, res: Response) => {
//     const { vmID, productIDArray } = req.body;
//     try {
//         let priceSum: number = 0;
//         for (let productID of productIDArray) {
//             // 1. 해당 상품 정보 가져오기
//             const product = await getProductById(productID);
//             if (!product) {
//                 res.status(404).send(`Product with id ${productID} not found.`);
//                 return;
//             }

//             // 2. 상품 재고 체크
//             if (!await checkProductStock(vmID, product)) {
//                 res.status(409).send(`Product with id ${productID} is out of stock.`);
//                 return;
//             } else {
//                 // 2-2. 선택된 상품 묶음 & 총합 계산
//                 priceSum += product.price;
//             }
//         }

//         // 가격 결제 API로 redirect !!??
//         // res.redirect(`/payment?vmID=${vmID}&price=${priceSum}`);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Failed to purchase product.');
//     }
// }
// );


// // 가격 결제 API
// app.post(
//     '/payment',
//     async (req: Request, res: Response) => {
//         // const { vmID, price, paymentMethod } = req.query;
//         const { vmID, price, paymentMethod, inputMoney } = req.body;
//         try {
//             // 가격 결제 로직 구현
//             const result = await payProductPrice(Number(vmID), Number(price), Number(paymentMethod), inputMoney);
//             if (!result) {
//                 res.status(500).send(`Failed to pay for product.`);
//                 return;
//             }
//             res.status(200).send(`Successfully paid ${price}won for product.`);
//         } catch (err) {
//             console.log(err);
//             res.status(500).send('Failed to pay for product.');
//         }
//     }
// );

