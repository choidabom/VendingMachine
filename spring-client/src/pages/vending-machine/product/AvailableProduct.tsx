import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { Container, ListItem } from "@mui/material";
import { ProductEntity } from "../../../entity/ProductEntity";
import { API_URL } from "../../../components/Config";
import { ProductContainer } from "./AvailableProduct.style";
import PaymentTransactionLogic from '../payment/PaymentTransactionLogic';
import ProductionActionButton from './button/ProductionActionButton';
import SaveMoneyStore from '../../../store/SaveMoneyStore';
import SelectedMoneyStore from '../../../store/SelectedMoneyStore';


const AvailableProduct = (props: { vmID: number; }) => {
    const vmID = props.vmID;
    const navigate = useNavigate();
    const { saveMoney } = SaveMoneyStore();
    const { setSelectedMoney } = SelectedMoneyStore();
    const [availableProducts, setAvailableProducts] = useState<Array<ProductEntity>>([]);
    const [selectedProducts, setSelectedProducts] = useState<Array<ProductEntity>>([]);

    useEffect(() => {
        if (vmID) {
            fetchAvailableProducts(); // 판매 가능 상품
            const storedSelectedProducts = localStorage.getItem('selectedProducts');
            if (storedSelectedProducts) {
                setSelectedProducts(JSON.parse(storedSelectedProducts));
            }
        } else {
            navigate('/'); // vmID가 없으면 홈으로 이동
        }
    }, [vmID]);

    useEffect(() => {
        localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
    }, [selectedProducts]);

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
            } else if (response.status === 500) {
                const errorMessage = await response.text();
                alert(errorMessage);
                navigate('/'); // vmID가 없으면 홈으로 이동
            }
            else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.log(error);
        }
    };

    //----------------------------------------------------------------------

    // 선택 상품 추가
    const handleSelectProduct = async (product: ProductEntity) => {
        // 지불 안 했을 경우, 선택 불가
        if (saveMoney === 0) {
            alert("상품 선택 전, 지불 방법을 택해주세요.");
            return;
        }

        // 지불 금액보다 많다면, 선택 불가
        const checkMoney = getTotalPrice() + product.price;
        if (saveMoney < checkMoney) {
            alert("잔액 부족으로 상품을 선택할 수 없습니다.");
            return;
        }

        // 상품 추가할 때마다 재고확인을 함으로써 가능한 상품을 보여줘야함.
        const updatedProducts = [...selectedProducts];
        const existingProduct = updatedProducts.find(p => p.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
            const checkProducts: ProductEntity[] = [...selectedProducts, existingProduct];
            if (!await checkProductAvailability(checkProducts)) {
                alert('재고 부족으로 상품을 선택할 수 없습니다.');
                // handleRemoveProduct(product);
                return;
            }
            setSelectedProducts(updatedProducts);
        } else {
            product.quantity = 1;
            const checkProducts: ProductEntity[] = [...selectedProducts, product];
            if (!await checkProductAvailability(checkProducts)) {
                alert('재고 부족으로 상품을 선택할 수 없습니다.');
                // handleRemoveProduct(product);
                return;
            }
            updatedProducts.push(product);
            setSelectedProducts(updatedProducts);
        };
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

    // 상품 선택 시 재고 여부 체크
    const checkProductAvailability = async (selectedProducts: ProductEntity[]) => {
        // console.log('selectedProducts: ', selectedProducts);

        try {
            const url = `${API_URL}/:${vmID}/checkAvailability`;
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    selectedProducts: selectedProducts,
                }),
            };

            const response = await fetch(url, requestOptions);
            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.log(error);
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
                                        {product.id}. {product.name} {product.price}원
                                    </p>
                                    <ProductionActionButton value="+" product={product} handleProduct={handleSelectProduct} />
                                </ListItem>
                            </ProductContainer>
                        ))}
                    </>
                )}
            </Container >
            <Container>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>상품 총합: {selectedTotalPrice}원</p>
                    <PaymentTransactionLogic vmID={vmID} totalPrice={selectedTotalPrice} selectedProducts={selectedProducts} handleProduct={handleRemoveProduct} />
                </div>
                {selectedProducts.length > 0 ? (
                    <>
                        {selectedProducts.map(product => (
                            <ListItem key={product.id}>
                                <div style={{ display: 'flex' }}>
                                    <p style={{ marginRight: '8px', width: "200px" }}>
                                        {product.id}. {product.name} {product.price}원
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
                    <p>선택된 상품이 없습니다.</p>
                )}
            </Container>
        </>
    );
};

export default AvailableProduct;
