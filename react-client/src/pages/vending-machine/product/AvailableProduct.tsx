import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Container, List, ListItem } from "@mui/material";
import { ProductEntity } from "../../../entity/ProductEntity";
import { API_URL } from "../../../components/Config";
import { ProductContainer } from "./AvailableProduct.style";

const AvailableProduct = (prop: { vmID: number; }) => {
    const vmID: number = prop.vmID;
    const navigate = useNavigate();
    const [availableProducts, setAvailableProducts] = useState<Array<ProductEntity>>([]);
    const [selectedProducts, setSelectedProducts] = useState<Array<ProductEntity>>([]);

    useEffect(() => {
        if (vmID) {
            handleAvailableProducts(); // 실행
        } else {
            navigate('/'); // vmID가 없으면 홈으로 이동
        }
    }, [vmID]); // vmID가 변경될 때만 실행

    // useEffect(() => {

    // }, [selectedProducts]);

    // 판매 가능 상품 GET
    const handleAvailableProducts = async () => {
        try {
            const url = `${API_URL}/:${vmID}/product`;
            let requestOptions: RequestInit = {
                method: "GET",
            };
            const response = await fetch(url, requestOptions);
            if (response.ok) {
                const data: Array<ProductEntity> = await response.json();
                setAvailableProducts(data);
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.log(error);
        }
    };


    // 선택 상품 추가
    const handleSelectProduct = (product: ProductEntity) => {
        setSelectedProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            const existingProduct = updatedProducts.find(p => p.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                product.quantity = 1;
                updatedProducts.push(product);
            }
            return updatedProducts;
        });
    };


    // 선택 상품 제거
    const handleRemoveProduct = (product: ProductEntity) => {
        setSelectedProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            const existingProduct = updatedProducts.find(p => p.id === product.id);
            if (existingProduct) {
                existingProduct.quantity -= 1;
                if (existingProduct.quantity <= 0) {
                    return updatedProducts.filter(p => p.id !== product.id);
                }
            }
            return updatedProducts;
        });
    };


    return (
        <>
            <Container>
                <h3 style={{ marginLeft: '16px' }}>선택 가능한 상품 리스트</h3>
                {availableProducts && (
                    <List >
                        {availableProducts.map(product => (
                            <ProductContainer key={product.id}>
                                <ListItem >
                                    [{product.id}] {product.name} - {product.price}원
                                </ListItem>
                                <button onClick={() => handleSelectProduct(product)}>﹢</button>
                                <button onClick={() => handleRemoveProduct(product)}>﹣</button>
                                <p>{selectedProducts.find(p => p.id === product.id)?.quantity || 0}</p>
                            </ProductContainer>
                        ))}
                    </List>
                )}
            </Container >
        </>
    );
};

export default AvailableProduct;


