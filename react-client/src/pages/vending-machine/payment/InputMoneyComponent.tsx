import { useState } from "react";
import { Input } from "@mui/material";
import SaveMoneyStore from "../../../store/SaveMoneyStore";

interface InputMoneyProps {
    paymentMethod: number;
}

const InputMoneyComponent: React.FC<InputMoneyProps> = ({ paymentMethod }) => {
    const paymentText = paymentMethod === 1 ? "입금액을 입력하세요: " : "카드를 넣어주세요: ";
    const [inputMoney, setInputMoney] = useState<number>(0);
    const { saveMoney, setSaveMoney } = SaveMoneyStore();

    // 자판기 돈 입금 
    const handleInputMoneyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const money = parseInt(inputValue);
        if (isNaN(money) || money < 0) {
            alert("잘못된 입력입니다. 다시 입력해주세요.");
            return;
        }
        setInputMoney(money);
    };

    // 자판기 입금액 저장
    const handleInputMoneySave = async (inputMoney: number) => {
        setSaveMoney(inputMoney);
    };

    // 입금액 Input 태그
    const moneyInput = () => {
        return <Input
            value={inputMoney}
            onChange={handleInputMoneyChange}
        />;
    };

    // 입금액 Input 버튼(for 저장) 태그 
    const saveInputMoney = () => {
        return <button
            style={{
                color: "white",
                width: "80px",
                height: "40px",
                padding: "10px 10px",
                margin: "5px"
            }} onClick={() => handleInputMoneySave(inputMoney)}
            type="submit">입금
        </button>;
    };

    return (
        <>
            <p>{paymentText}</p>
            {paymentMethod === 1 ?
                <>
                    {moneyInput()}
                    {saveInputMoney()}
                    <p>입금액: {saveMoney}원</p>
                </> : <div>확인되었습니다!
                    <p>카드 잔액: {saveMoney}원</p>
                </div>}
        </>
    );
};

export default InputMoneyComponent;