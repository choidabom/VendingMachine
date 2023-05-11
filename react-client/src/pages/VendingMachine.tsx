import { useParams } from "react-router-dom";
import AvailableProduct from './vending-machine/product/AvailableProduct';
import { VMContainer } from './VendingMachine.style';

const VendingMachine = () => {
    const { vmID } = useParams();
    console.log('Vending Machine 확인');

    return (
        <>
            <VMContainer>
                <AvailableProduct vmID={Number(vmID)} />
            </VMContainer>
        </>
    );
};
export default VendingMachine;
