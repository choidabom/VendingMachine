import { useParams } from "react-router-dom";
import { VMContainer } from './VendingMachine.style';
import PayMoneyLogic from "./vending-machine/payment/PayMoneyLogic";
import AvailableProduct from './vending-machine/product/AvailableProduct';

const VendingMachine = () => {
    const { vmID } = useParams();

    return (
        <>
            <VMContainer>
                <PayMoneyLogic />
                <AvailableProduct vmID={Number(vmID)} />
            </VMContainer>
        </>
    );
};
export default VendingMachine;
