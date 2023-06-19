import { useParams } from "react-router-dom";
import { LeftContainer, RightContainer, VMContainer } from './VendingMachine.style';
import PayMoneyLogic from "./vending-machine/payment/PayMoneyLogic";
import AvailableProduct from './vending-machine/product/AvailableProduct';
import { API_URL } from "../components/Config";
import { useEffect } from "react";

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
            let requestOptions: RequestInit = {
                method: "GET",
            };
            const response = await fetch(url, requestOptions);
            if (response.ok) {
                const okMessage = await response.text();
                console.log(okMessage);
            } else if (response.status === 500) {
                const errorMessage = await response.text();
                console.log(errorMessage);
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.log(error);
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
