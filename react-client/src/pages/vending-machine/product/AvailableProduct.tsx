import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Container, List, ListItem } from "@mui/material";
import { ProductEntity } from "../../../entity/ProductEntity";
import { API_URL } from "../../../components/Config";
import { ProductContainer } from "./AvailableProduct.style";
import vmIDStore from '../../../store/vmIDStore';
import Payment from '../payment/Payment';

const AvailableProduct = () => {
    const navigate = useNavigate();
    const { vmID } = vmIDStore();
    const [availableProducts, setAvailableProducts] = useState<Array<ProductEntity>>([]);
    const [selectedProducts, setSelectedProducts] = useState<Array<ProductEntity>>([]);
    const [completeSelect, setCompleteSelect] = useState<Array<ProductEntity>>([]);


    useEffect(() => {
        if (vmID) {
            fetchAvailableProducts(); // 실행
        } else {
            navigate('/'); // vmID가 없으면 홈으로 이동
        }
    }, [vmID]); // vmID가 변경될 때만 실행

    // 판매 가능 상품 GET
    const fetchAvailableProducts = async () => {
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

    //----------------------------------------------------------------------

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

    //----------------------------------------------------------------------

    // 상품 선택 완료
    const handleCompleteSelect = async () => {
        const selectedIDs: Array<number> = selectedProducts.flatMap(product => {
            const ids = [];
            for (let i = 0; i < product.quantity; i++) {
                ids.push(product.id);
            }
            return ids;
        });
        console.log(selectedIDs);
        try {
            const selectedProductsComplete = await fetchSelectedProducts(selectedIDs);
            setCompleteSelect(selectedProductsComplete);
        } catch (error) {
            console.log('Error fetching selected products:', error);
        }
    };

    // 선택 상품 재고 확인
    const fetchSelectedProducts = async (selectedIDs: Array<number>) => {
        try {
            const url = `${API_URL}/:${vmID}/product/select`;
            let requestOptions: RequestInit = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    selectedIDs: selectedIDs
                })
            };

            const response = await fetch(url, requestOptions);
            if (response.ok) {
                const data = await JSON.parse(await response.text());
                return data;
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.log('There was a problem with your fetch operation: ', error);
            return [];
        }
    };

    //----------------------------------------------------------------------

    // 선택 상품 총합
    const getTotalPrice = () => {
        const total = selectedProducts.reduce((acc, curr) => {
            return acc + curr.price * curr.quantity;
        }, 0);
        return total;
    };
    const totalPrice = useMemo(() => getTotalPrice(), [selectedProducts]);
    console.log('AvailableProduct 확인');


    return (
        <>
            <Container>
                <h3>Vending Machine ID {vmID}</h3>
                <h3>Available Products </h3>
                {availableProducts && (
                    <List >
                        {availableProducts.map(product => (
                            <ProductContainer key={product.id}>
                                <ListItem >
                                    <div style={{ display: 'flex' }}>
                                        <p style={{ marginRight: '8px', width: "200px" }}>
                                            [{product.id}] {product.name} {product.price}won
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', width: "100px" }}>
                                        <button style={{
                                            color: "white", width: "40px", height: "40px", padding: "10px 10px", margin: "5px"
                                        }} onClick={() => handleSelectProduct(product)}>﹢</button>
                                        <button style={{
                                            color: "white", width: "40px", height: "40px", padding: "10px 10px", margin: "5px"
                                        }} onClick={() => handleRemoveProduct(product)}>﹣</button>
                                    </div>
                                    <div style={{ display: 'flex', width: "30px" }}>
                                        <p>{selectedProducts.find(p => p.id === product.id)?.quantity || 0}</p>
                                    </div>
                                </ListItem>
                            </ProductContainer>
                        ))}
                        <div style={{ display: 'flex' }}>
                            <button style={{
                                marginLeft: "auto",
                                color: "white", width: "80px", height: "40px", padding: "10px 10px", margin: "5px"
                            }} onClick={handleCompleteSelect}>선택완료</button>
                        </div>
                    </List>
                )}
            </Container >
            <Container>
                <h3>Selected Product</h3>
                <h3>Total Price: {totalPrice}won</h3>
                {selectedProducts.length > 0 ? (
                    <List>
                        {selectedProducts.map(product => (
                            <ListItem key={product.id}>
                                <div style={{ display: 'flex' }}>
                                    <p style={{ marginRight: '8px', width: "200px" }}>
                                        [{product.id}] {product.name} {product.price}won
                                    </p>
                                </div>
                                <div style={{ display: 'flex', width: "30px" }}>
                                    <p>{product.quantity}</p>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <p>No products selected.</p>
                )}

            </Container>
            <Container>
                <Payment totalPrice={totalPrice} selectedProducts={completeSelect} />
            </Container>
        </>
    );
};

export default AvailableProduct;
