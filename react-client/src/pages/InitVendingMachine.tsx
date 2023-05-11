import React, { useState } from "react";
import { Input, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { API_URL } from "../components/Config";
import { InitVMContainer } from "./InitVendingMachine.style";

const InitVendingMachine = () => {
    const [vmID, setVMId] = useState<number>(0);
    const navigate = useNavigate();

    // VendingMachine ID 체크 함수 
    const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const isNumeric = /^\d+$/.test(inputValue);
        setVMId(isNumeric ? Number(inputValue) : 0);
    };

    // VendingMachine Init 함수
    const handleVMInit = async () => {
        if (!vmID) {
            alert("자판기 ID를 입력하세요 !");
            return;
        }
        try {
            const url = `${API_URL}/:${vmID}`;
            let requestOptions: RequestInit = {
                method: "GET",
            };
            const response = await fetch(url, requestOptions);
            if (response.ok) {
                const data = await response.text();
                console.log('handleVMInit', data);
                navigate(`/vm/${vmID}`);
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <InitVMContainer>
                <Input
                    placeholder="자판기 ID를 입력하세요"
                    value={vmID}
                    onChange={handleIdChange}
                />
                <button style={{
                    color: "white", width: "80px", height: "40px", padding: "10px 10px", margin: "5px"
                }} onClick={handleVMInit}>Run VM</button>
            </InitVMContainer>
        </>
    );
};

export default InitVendingMachine;
