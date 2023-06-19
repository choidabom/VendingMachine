import React from "react";

interface PaymentMethodButtonProps {
    paymentNum: number;
    handlePaymentMethod: (paymentNumber: number) => void;
}

// Payment Method 버튼 (1: 현금, 2: 카드)
const PaymentMethodButton: React.FC<PaymentMethodButtonProps> = ({ paymentNum, handlePaymentMethod }) => {
    const buttonText = paymentNum === 1 ? "현금" : "카드";

    return (
        <button
            style={{
                color: "white",
                width: "80px",
                height: "40px",
                padding: "10px 10px",
                margin: "5px"
            }} onClick={() => handlePaymentMethod(paymentNum)}
            type="submit">{buttonText}
        </button>
    );
};

export default PaymentMethodButton;