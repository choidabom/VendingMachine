import styled from 'styled-components';

const ProductContainer = styled.div`
    display: flex;
    width: 400px;
    flex-direction: row;

    & > * {
        margin: 5px;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
    }
    & > ListItem {
        width: 270px;
    }
    & > button{
        color : white;
        width: 41px;
        height: 41px;
        padding: 10px 10px;
    }
`;
export { ProductContainer };