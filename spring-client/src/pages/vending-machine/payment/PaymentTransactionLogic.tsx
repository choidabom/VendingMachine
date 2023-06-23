import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../Config';
import { ProductEntity } from '../../../entity/ProductEntity';
import SaveMoneyStore from '../../../store/SaveMoneyStore';
import PaymentMethodStore from '../../../store/SelectedPaymentMethod';


interface PaymentTransactionProps {
    vmID: number;
    totalPrice: number;
    selectedProducts: Array<ProductEntity>;
    handleProduct: (product: ProductEntity) => void;
}

const PaymentTransactionLogic: React.FC<PaymentTransactionProps> = ({ vmID, totalPrice, selectedProducts, handleProduct }) => {
    const { saveMoney } = SaveMoneyStore();
    const { paymentMethod } = PaymentMethodStore();
    const [paymentData, setPaymentData] = useState<string | null>(null);
    const [paymentInProgress, setPaymentInProgress] = useState(false); // 결제하기 중복을 방지하기 위함.
    const payMethod = paymentMethod === 1 ? "현금" : "카드";

    useEffect(() => {
        if (paymentData) {
            // localStorage.removeItem('selectedProducts');
            setTimeOutFunction();
        }

    }, [paymentData]);


    const handlePaymentTransaction = async () => {
        if (paymentInProgress) return;

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
                return;
            }
            setPaymentInProgress(true);
            const url = `${API_URL}/${vmID}/order`;
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
                const data = await response.text();
                setPaymentData(data);
                alert(`${payMethod} 결제 되었습니다.`);
                return data;
            } else {
                throw new Error('Network response was not ok.');
            };
        } catch (error) {
            console.log('오류가 발생했습니다.', error);
        } finally {
            setPaymentInProgress(false);
        }
    };

    const setTimeOutFunction = () => {
        setTimeout(() => {
            window.location.reload(); // 페이지 새로고침
        }, 4000);
    };

    return (
        <>
            {paymentData ?
                <>
                    {paymentData && (
                        <div>
                            {paymentMethod === 1 ? <p>반환 금액: {paymentData}원</p> : null}
                            <p>잠시 후 새로고침 됩니다.</p>
                        </div>
                    )}</> :
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
                </>}
        </>
    );
};

export default PaymentTransactionLogic;
