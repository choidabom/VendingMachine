import { useParams } from "react-router-dom";
import { LeftContainer, RightContainer, VMContainer } from './VendingMachine.style';
import PayMoneyLogic from "./vending-machine/payment/PayMoneyLogic";
import AvailableProduct from './vending-machine/product/AvailableProduct';
import { useEffect, useState } from "react";
import { API_URL } from "../Config";

const VendingMachine = () => {
    const { vmID } = useParams();
    useEffect(() => {
        if (vmID) {
            handleVMInit(); // 판매 가능 상품
        }
    }, []);

    // VendingMachine Init 함수
    const handleVMInit = async () => {
        if (!vmID) {
            alert("자판기 ID를 입력하세요 !");
            return;
        }
        try {
            const url = `${API_URL}/${vmID}`;
            const requestOptions: RequestInit = {
                headers: {
                    Accept: "application/json",
                },
                method: "GET",
            };

            const response = await fetch(url, requestOptions);
            if (response.status == 200) {
                const okMessage = await response.json();
            } else if (response.status === 500) {
                const errorMessage = await response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            // fetch 에서 예외가 발생한 경우 catch 블록이 실행됨.
            // 상태 코드가 500인 경우에도 catch 블록이 실행됨.
            console.log("error: ", error);
        }
    };

    return (
        <>
            <VMContainer>
                <LeftContainer>
                    <PayMoneyLogic />
                </LeftContainer>
                <RightContainer>
                    <AvailableProduct vmID={Number(vmID)} />
                </RightContainer>
            </VMContainer>
        </>
    );
};

export default VendingMachine;
