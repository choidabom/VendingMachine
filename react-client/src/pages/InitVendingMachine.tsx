import React, { useState } from "react";
import { Input, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { API_URL } from "../components/Config";
import { InitVMContainer } from "./InitVendingMachine.style";
import vmIDStore from "../store/vmIDStore";

const InitVendingMachine = () => {
    const { vmID, setVMId } = vmIDStore();
    const navigate = useNavigate();

    // VendingMachine ID 변화 함수 
    const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const isNumeric = /^\d+$/.test(inputValue);
        setVMId(isNumeric ? Number(inputValue) : 0);
    };

    // VendingMachine Init 함수
    const handleGetInitClick = async () => {
        if (!vmID) {
            alert("Input Vending Machine ID");
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
                console.log(data);
                navigate(`/vm`);
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
                }} onClick={handleGetInitClick}>Run VM</button>
            </InitVMContainer>
        </>
    );
};

export default InitVendingMachine;
