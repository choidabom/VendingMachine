import styled from "styled-components";
import React, { useState } from "react";
import { Input, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { API_URL } from "../components/Config";
import { InitVMContainer } from "./InitVendingMachine.style";

const InitVendingMachine = () => {
    const [vendingMachineId, setVendingMachineId] = useState<number | "">("");
    const navigate = useNavigate();


    // VendingMachine ID 변화 함수 
    const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const isNumeric = /^\d+$/.test(inputValue);
        setVendingMachineId(isNumeric ? Number(inputValue) : "");
    };


    // VendingMachine Init 함수
    const handleGetInitClick = async () => {
        if (!vendingMachineId) {
            console.log("자판기 ID를 입력하세요");
            return;
        }
        try {
            const url = `${API_URL}/:${vendingMachineId}`;
            let requestOptions: RequestInit = {
                method: "GET",
            };
            const response = await fetch(url, requestOptions);
            if (response.ok) {
                const data = await response.text();
                navigate(`/vm/${vendingMachineId}`);
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
                    value={vendingMachineId}
                    onChange={handleIdChange}
                />
                <Button variant="contained" onClick={handleGetInitClick}>
                    자판기 생성
                </Button>
            </InitVMContainer>
        </>
    );
};

export default InitVendingMachine;
