import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, ListItem } from "@mui/material";
import { ProductEntity } from "../../../entity/ProductEntity";
import { API_URL } from "../../../components/Config";
import { ProductContainer } from "./AvailableProduct.style";
import PaymentTransactionLogic from '../payment/PaymentTransactionLogic';
import ProductionActionButton from './button/ProductionActionButton';
import SaveMoneyStore from '../../../store/SaveMoneyStore';

const AvailableProduct = (props: { vmID: number; }) => {
    const vmID = props.vmID;
    const navigate = useNavigate();
    const { saveMoney } = SaveMoneyStore();
    const [availableProducts, setAvailableProducts] = useState<Array<ProductEntity>>([]);
    const [selectedProducts, setSelectedProducts] = useState<Array<ProductEntity>>([]);
    const [completeSelect, setCompleteSelect] = useState<Array<ProductEntity>>([]);

    useEffect(() => {
        if (vmID) {
            fetchAvailableProducts(); // 판매 가능 상품
        } else {
            navigate('/'); // vmID가 없으면 홈으로 이동
        }
    }, [vmID]);


    // Vending Machine 내 판매 가능 상품 GET
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
        if (saveMoney === 0) {
            alert("상품 선택 전, 지불 방법을 택해주세요.");
            return;
        }
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
    const selectedTotalPrice = useMemo(() => getTotalPrice(), [selectedProducts]);

    return (
        <>
            <Container>
                <p>상품을 둘러보고, 원하는 것을 골라보세요!</p>
                {availableProducts && (
                    <>
                        {availableProducts.map(product => (
                            <ProductContainer key={product.id}>
                                <ListItem >
                                    <p style={{ marginRight: '8px', width: "200px" }}>
                                        {product.id}. {product.name} {product.price}won
                                    </p>
                                    <ProductionActionButton value="+" product={product} handleProduct={handleSelectProduct} />
                                </ListItem>
                            </ProductContainer>
                        ))}
                        {/* <button style={{
                            marginLeft: "auto",
                            color: "white", width: "80px", height: "40px", padding: "10px 10px", margin: "5px"
                        }} onClick={handleCompleteSelect}>선택완료</button> */}
                    </>
                )}
            </Container >
            <Container>
                <p>Total Price: {selectedTotalPrice}won</p>
                {selectedProducts.length > 0 ? (
                    <>
                        {selectedProducts.map(product => (
                            <ListItem key={product.id}>
                                <div style={{ display: 'flex' }}>
                                    <p style={{ marginRight: '8px', width: "200px" }}>
                                        {product.id}. {product.name} {product.price}won
                                    </p>
                                </div>
                                <div style={{ display: 'flex', width: "30px" }}>
                                    <p>{product.quantity}</p>
                                </div>
                                <ProductionActionButton value="-" product={product} handleProduct={handleRemoveProduct} />
                            </ListItem>
                        ))}
                    </>
                ) : (
                    <p>No products selected.</p>
                )}
            </Container>
            <PaymentTransactionLogic vmID={vmID} totalPrice={selectedTotalPrice} selectedProducts={selectedProducts} />
        </>
    );
};

export default AvailableProduct;
