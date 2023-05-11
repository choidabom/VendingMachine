import React, { useState, useEffect } from 'react';
import AvailableProduct from './vending-machine/product/AvailableProduct';
import { VMContainer } from './VendingMachine.style';

const VendingMachine = () => {
    console.log('VendingMachine 확인');
    return (
        <>
            <VMContainer>
                <AvailableProduct />
            </VMContainer>
        </>
    );
};
export default VendingMachine;
