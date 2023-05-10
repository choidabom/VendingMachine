import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { ProductEntity } from "../entity/ProductEntity";
import { API_URL } from '../components/Config';
import AvailableProduct from './vending-machine/product/AvailableProduct';
import { VMContainer } from './VendingMachine.style';

const VendingMachine = () => {
    const params = useParams();
    const vmID: number = Number(params.vmID);
    // const [availableProducts, setAvailableProducts] = useState<Array<ProductEntity>>([]);
    // const [totalPrice, setTotalPrice] = useState<number>(0);


    // useEffect(() => {
    //     setTotalPrice(calculateTotalPrice(selectedProducts));
    // }, [selectedProducts]); // 선택된 상품들의 price가 누적되게끔 계산

    // // 제품 총합 계산
    // const calculateTotalPrice = (products: Array<ProductEntity>) => {
    //     const total = products.reduce((acc, cur) => acc + cur.price, 0);
    //     return total;
    // };

    console.log('renderVM'); // 몇 번 그리는지

    return (
        <>
            <VMContainer>
                <AvailableProduct vmID={vmID} />
            </VMContainer>
        </>
    );


};

export default VendingMachine;
