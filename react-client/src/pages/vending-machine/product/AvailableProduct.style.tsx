import styled from 'styled-components';

const ProductContainer = styled.div`
    & > Container {
        display: flex;
        flex-direction: row;
    }
`;
export { ProductContainer };