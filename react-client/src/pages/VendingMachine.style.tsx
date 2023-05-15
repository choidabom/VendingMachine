import styled from "styled-components";

const VMContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 750px;
    height: 600px;
    background-color: #f1f1f1;
    border: 1px solid #ccc;
    padding: 20px;
    margin: 0 auto;
    margin-top: 20px;
`;


const LeftContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const RightContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

export { VMContainer, LeftContainer, RightContainer };
