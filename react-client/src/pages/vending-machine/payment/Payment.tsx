import React, { useState } from 'react';
import { API_URL } from '../../../components/Config';
import { ProductEntity } from '../../../entity/ProductEntity';
import { Input } from '@mui/material';

const Payment = (props: { vmID: number, totalPrice: number, selectedProducts: Array<ProductEntity>; }) => {
    const vmID = props.vmID;
    const totalPrice = props.totalPrice;
    const selectedProducts = props.selectedProducts;
    const [paymentMethod, setPaymentMethod] = useState<number>(0);
    const [inputMoney, setInputMoney] = useState("");

    const handlePaymentMethodClick = (paymentNum: number) => {
        setPaymentMethod(paymentNum);
    };

    const handleInputMoneyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputMoney(event.target.value);
    };

    const handlePayment = async () => {
        if (!totalPrice || !selectedProducts) {
            console.log("상품을 선택해주세요.");
            return;
        }

        if (!paymentMethod || !inputMoney) {
            console.log("지불 방법과 금액을 입력해주세요.");
            alert("지불 방법과 금액을 입력해주세요.");
            return;
        }

        console.log(vmID, selectedProducts, paymentMethod, inputMoney);

        try {
            const money = parseInt(inputMoney);
            if (isNaN(money) || money < 0) {
                alert("잘못된 입력입니다. 다시 입력해주세요.");
                return;
            } else if (money - totalPrice < 0) {
                alert("입금액이 부족합니다.");
            }

            const url = `${API_URL}/:${vmID}/order`;
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selectedProducts: selectedProducts,
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
                })
                .catch((error: any) => {
                    console.log('There was a problem with your fetch operation: ', error);
                });

        } catch (error) {
            console.log('오류가 발생했습니다.', error);
        }
    };
    console.log('Payment 확인');

    return (
        <>
            <h3>Selected Purchase</h3>
            <div style={{ display: 'flex' }}>
                <button style={{
                    color: "white", width: "80px", height: "40px", padding: "10px 10px", margin: "5px"
                }} onClick={() => handlePaymentMethodClick(1)} type="submit">Cash</button>
                <button style={{
                    color: "white", width: "80px", height: "40px", padding: "10px 10px", margin: "5px"
                }} onClick={() => handlePaymentMethodClick(1)} type="submit">Card</button>
            </div>
            <div style={{ display: 'flex' }}>
                <h3>Input your {paymentMethod === 1 ? "Cash" : "Card Balance"}</h3>

            </div>
            <div style={{ display: 'flex', flexDirection: "row" }}>
                <Input
                    value={inputMoney}
                    onChange={handleInputMoneyChange}
                />
                <button style={{
                    color: "white", width: "80px", height: "40px", padding: "10px 10px", margin: "5px"
                }} onClick={handlePayment}>결제하기</button>
            </div>


        </>
    );
};

export default Payment;
