import { Container } from '@mui/material';
import styled from 'styled-components';

const ProductContainer = styled(Container)`
    & > Container {
        display: flex;
        flex-direction: row;
    }
`;
export { ProductContainer };