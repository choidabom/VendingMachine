import React, { useState } from 'react';
import { API_URL } from '../../../components/Config';
import { ProductEntity } from '../../../entity/ProductEntity';
import SaveMoneyStore from '../../../store/SaveMoneyStore';
import PaymentMethodStore from '../../../store/SelectedPaymentMethod';

interface PaymentTransactionProps {
    vmID: number;
    totalPrice: number;
    selectedProducts: Array<ProductEntity>;
}

const PaymentTransactionLogic: React.FC<PaymentTransactionProps> = ({ vmID, totalPrice, selectedProducts }) => {
    const { saveMoney } = SaveMoneyStore();
    const { paymentMethod } = PaymentMethodStore();

    const handlePaymentTransaction = async () => {
        if (!totalPrice || !selectedProducts) {
            alert("상품을 선택하지 않았기에 결제할 수 없습니다.");
            return;
        }

        try {
            if (isNaN(saveMoney) || saveMoney < 0) {
                alert("잘못된 입력입니다. 다시 입력해주세요.");
                return;
            } else if (saveMoney - totalPrice < 0) {
                alert("입금액이 부족합니다.");
            }

            const url = `${API_URL}/:${vmID}/order`;
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selectedProducts: selectedProducts,
                    paymentMethod: paymentMethod,
                    inputMoney: saveMoney
                })
            };
            const response = await fetch(url, requestOptions);
            if (response.ok) {
                const data = response.text();
                console.log(data);
            } else {
                throw new Error('Network response was not ok.');
            };
        } catch (error) {
            console.log('오류가 발생했습니다.', error);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: "row" }}>
                <button style={{
                    color: "white",
                    width: "80px",
                    height: "40px",
                    padding: "10px 10px",
                    margin: "5px"
                }} onClick={handlePaymentTransaction}>결제하기</button>
            </div>
        </>
    );
};

export default PaymentTransactionLogic;
