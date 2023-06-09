import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../components/Config';
import { ProductEntity } from '../../../entity/ProductEntity';
import SaveMoneyStore from '../../../store/SaveMoneyStore';
import PaymentMethodStore from '../../../store/SelectedPaymentMethod';


interface PaymentTransactionViewProps {
    totalPrice: number;
    selectedProducts: Array<ProductEntity>;
    handlePaymentTransaction: () => void;
    paymentInProgress: boolean;
    paymentMethod: number;
    paymentData: string | null;
    payMethod: string;
}

const PaymentTransactionView: React.FC<PaymentTransactionViewProps> = ({
    totalPrice,
    selectedProducts,
    handlePaymentTransaction,
    paymentInProgress,
    paymentMethod,
    paymentData,
    payMethod
}) => {

    const renderPaymentResult = () => {
        if (paymentData) {
            return (
                <div>
                    {paymentMethod === 1 ? <p>반환 금액: {paymentData}원</p> : null}
                    <p>잠시 후 새로고침 됩니다.</p>
                </div >
            );
        } return (
            <div style={{ display: 'flex', flexDirection: "row" }}>
                <button style={{
                    color: "white",
                    width: "80px",
                    height: "40px",
                    padding: "10px 10px",
                    margin: "5px"
                }} onClick={handlePaymentTransaction}>결제하기</button>
            </div>
        );
    };

    return (
        <>{renderPaymentResult()}</>
    );
};

export default PaymentTransactionView;
