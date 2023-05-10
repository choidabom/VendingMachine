import React, { useState } from "react";
import { API_URL } from "../components/Config";

const Payment = () => {
    const [insertedMoney, setInsertedMoney] = useState(0);

    // 입금액 POST
    const handleInputMoney = async () => {
        try {
            // const url = `${API_URL}/:${vmID}/order`;
            // const requestOptions: RequestInit = {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({
            //         // selectedProducts: selectedProducts,
            //         // paymentMethod: paymentMethod,
            //         // inputMoney: inputMoney
            //     })
            // };
            // const response = await fetch(url, requestOptions);
            // if (response.ok) {
            //     const data = await response.text();
            // } else {
            //     throw new Error('Network response was not ok.');
            // }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
        
        </>
    );
};

export default Payment;