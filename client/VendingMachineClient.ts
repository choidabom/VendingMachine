import fetch, { RequestInit } from 'node-fetch';
import { rl } from "./input/readlineInput";
import { ProductEntity } from "./entity/ProductEntity";
import { showSelectedProductList } from './views/ProductRepository';

class VendingMachineClient {
    id?: number;
    constructor() { }

    async initVendingMachine(): Promise<boolean> {
        return new Promise<boolean>((res, rej) => {
            rl.question("자판기 ID를 입력하세요: ", async (input: string) => {
                const vmID = parseInt(input);
                const url = `http://localhost:3000/vending_machine/:${vmID}`;
                let requestOptions: RequestInit = {
                    method: "GET",
                };

                fetch(url, requestOptions)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok.');
                        }
                        return response.text();
                    })
                    .then((result: any) => {
                        console.log(result);
                        res(true);
                    })
                    .catch((error: any) => {
                        rej(error);
                    });

                this.id = vmID;
            });
        });

    }

    async getAvailableProducts() {
        const url = `http://localhost:3000/vending_machine/:${this.id}/product`;
        let requestOptions: RequestInit = {
            method: "GET",
        };


        return new Promise<Array<ProductEntity>>((res, rej) => {
            fetch(url, requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok, ${response.status} error.`);
                    }
                    return response.json();
                })
                .then((result: Array<ProductEntity>) => {
                    res(result);
                })
                .catch((error: any) => {
                    console.log('There was a problem with your fetch operation: ', error);
                    rej(error);
                });
        });
    }

    async selectProducts(availableProducts: Array<ProductEntity>) {
        console.log(availableProducts.map(e => `[${e.id}] ${e.name}`).join(', '));
        return new Promise<Array<ProductEntity>>(async (resolve, reject) => {

            const productID = await new Promise<number>((res, rej) => {
                rl.question(
                    "구매할 음료 번호를 입력하세요(취소: 0) : ",
                    async (input: string) => {
                        try {
                            const selectedNum = parseInt(input);
                            if (selectedNum === 0) {
                                console.log('취소되었습니다.');
                                res(0);
                            } else {
                                // console.log(selectedNum);
                                res(selectedNum);
                            }
                        } catch (error) {
                            console.log("잘못된 입력입니다.");
                            // console.log("잘못된 입력입니다. 다시 입력해주세요.");
                            // res(await this.selectProducts(availableProducts));
                        }
                    }
                );
            });

            if (productID === 0) {
                resolve([]);
            } else {
                const selectedProduct = availableProducts.find(product => product.id === productID);
                if (!selectedProduct) {
                    console.log('잘못된 상품 번호입니다. 다시 입력해주세요.');
                    resolve(await this.selectProducts(availableProducts));
                }
                const url = `http://localhost:3000/vending_machine/${this.id}/product/${productID}`;
                let requestOptions: RequestInit = {
                    method: "POST",
                };
                fetch(url, requestOptions)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Network response was not ok, ${response.status} error.`);
                        }
                        return response.text();
                    })
                    .then((result: any) => {
                        resolve(JSON.parse(result));
                        // resolve(productID);
                    })
                    .catch((error: any) => {
                        console.log('There was a problem with your fetch operation: ', error);
                        reject(error);
                    });
            }
        });
    }

    async sellProducts(selectedProduct: Array<ProductEntity>) {
        return new Promise((resolve, reject) => {
            rl.question("지불 방법을 선택하세요 (1: 현금, 2: 카드): ",
                async (answer: string) => {
                    const paymentMethod = parseInt(answer);
                    if (isNaN(paymentMethod) || paymentMethod < 1 || paymentMethod > 2) {
                        console.log("지불 방법을 다시 입력해주세요.");
                        const result = this.sellProducts(selectedProduct);
                        resolve(result);
                    } else {
                        let inputMoney: number = 0;
                        if (paymentMethod === 1) {
                            try {
                                inputMoney = await new Promise((resolve, reject) => {
                                    rl.question("입금액을 입력해주세요: ", async (answer: string) => {
                                        const money = parseInt(answer);
                                        if (isNaN(money) || money < 0) {
                                            reject("잘못된 입력입니다.");
                                        } else {
                                            resolve(money);
                                        }
                                    });
                                });
                            } catch (error) {
                                console.log(error);
                                reject(error);
                                return;
                            }
                        } else {
                            try {
                                inputMoney = await new Promise((resolve, reject) => {
                                    rl.question("카드 결제를 진행합니다. 금액(카드 잔액)을 입력해주세요: ", async (answer: string) => {
                                        const money = parseInt(answer);
                                        if (isNaN(money) || money < 0) {
                                            reject("잘못된 입력입니다.");
                                        } else {
                                            resolve(money);
                                        }
                                    });
                                });
                            } catch (error) {
                                console.log(error);
                                reject(error);
                                return;
                            }
                        }
                        const url = `http://localhost:3000/vending_machine/${this.id}/order`;
                        const requestOptions: RequestInit = {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                selectedProduct: selectedProduct,
                                paymentMethod: paymentMethod,
                                inputMoney: inputMoney
                            })
                        };
                        fetch(url, requestOptions)
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`Network response was not ok, ${response.status} error.`);
                                }
                                return response.text();
                            })
                            .then((result: any) => {
                                console.log(result);
                                resolve(result);
                            })
                            .catch((error: any) => {
                                console.log('There was a problem with your fetch operation: ', error);
                                reject(error);
                            });

                    }
                });
        });
    }

    async sales() {
        const products = await this.getAvailableProducts();
        const selectedProduct = await this.selectProducts(products);
        await showSelectedProductList(selectedProduct);
        if (selectedProduct.length > 0) {
            await this.sellProducts(selectedProduct);
        }
        return true;
    }
}

const vm = new VendingMachineClient();

(async () => {
    if (await vm.initVendingMachine()) {
    }
    await vm.sales();
    // while (await vm.sales()) {
    //     console.log("Loop~!!!!!!!!!");
    // }
    process.exit();
})();
