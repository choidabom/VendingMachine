import { Container, Input } from "@mui/material";
import PaymentMethodButton from "./PaymentMethodButton";
import SaveMoneyStore from "../../../store/SaveMoneyStore";
import InputMoneyComponent from "./InputMoneyComponent";
import PaymentMethodStore from "../../../store/SelectedPaymentMethod";

const PayMoneyLogic = () => {
    const { setSaveMoney } = SaveMoneyStore();
    const { paymentMethod, setPaymentMethod } = PaymentMethodStore();

    const handlePaymentMethod = (paymentNum: number) => {
        setPaymentMethod(paymentNum);
        setSaveMoney(0); // 지불 방법을 다시 선택했을 경우, 기존 입금액 초기화
        if (paymentNum === 2) {
            setSaveMoney(50000); // 임시방편으로 카드를 선택했을 경우, 카드의 잔액을 나타내기 위함. 
        }
    };

    return (
        <>
            <Container>
                <p>자판기를 이용하시겠습니까? <br /> 지불 방법을 선택해주세요!</p>
                <PaymentMethodButton paymentNum={1} handlePaymentMethod={handlePaymentMethod} />
                <PaymentMethodButton paymentNum={2} handlePaymentMethod={handlePaymentMethod} />
            </Container >
            {paymentMethod ? (
                <Container>
                    <InputMoneyComponent paymentMethod={paymentMethod} />
                </Container>
            ) : null}
        </>

    );
};

export default PayMoneyLogic;