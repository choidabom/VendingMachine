import { Box } from "@mui/material";
import styled from "styled-components";

const InitVMContainer = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100vh;
    & > * {
        margin: 10px;
    }
`;

export { InitVMContainer };