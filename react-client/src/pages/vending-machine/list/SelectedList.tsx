// import { Button } from '@mui/material';
// import styled from 'styled-components';

// const SelectedProductContainer = styled.div`
//   display: flex;
//   flex-direction: column;
// `;

// const SelectedProductItem = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin-bottom: 8px;
// `;

// const SelectedProductText = styled.p`
//   margin-right: 8px;
// `;

// const SelectedProducts = ({ selectedProducts, handleRemoveProduct }) => {


//     return (
//         <>
//             <h3>선택된 제품</h3>
//             <SelectedProductContainer>
//                 {selectedProducts.map((product, index) => (
//                     <SelectedProductItem key={`product-${product.id}-${index}`}>
//                         <SelectedProductText>[{product.id}] {product.name} - {product.price}원</SelectedProductText>
//                         <Button onClick={() => handleRemoveProduct(product)}>삭제</Button>
//                     </SelectedProductItem>
//                 ))}
//             </SelectedProductContainer>
//         </>
//     );
// };

// export default SelectedProducts;